/**
 * Test cases for Kirin Tor Mage
 * 
 * 1. kirin-tor-mage-play: Player A plays Kirin Tor Mage
 * 2. secret-cost-reduction: Player A plays Ice Barrier with reduced cost (0)
 * 3. second-secret-normal-cost: Player A plays second secret with normal cost
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil } from "hearthstone-core";
import { KirinTorMageModel } from "./index";
import { IceBarrierModel } from "../ice-barrier";
import { CounterspellModel } from "../counterspell";
import { boot } from "../boot";

describe('kirin-tor-mage', () => {
    const game = new GameModel(() => ({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [] }
                    })),
                    hand: new HandModel(() => ({
                        child: {
                            minions: [new KirinTorMageModel()],
                            spells: [new IceBarrierModel(), new CounterspellModel()]
                        }
                    })),
                    deck: new DeckModel(() => ({
                        child: {
                            minions: []
                        }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [] }
                    })),
                    hand: new HandModel(() => ({
                        child: { spells: [] }
                    }))
                }
            }))
        }
    }));
    boot(game);

    const playerA = game.child.playerA;
    const handA = playerA.child.hand;
    const boardA = playerA.child.board;
    const cardC = handA.child.minions.find(item => item instanceof KirinTorMageModel);
    const cardD = handA.child.spells.find(item => item instanceof IceBarrierModel);
    const cardE = handA.child.spells.find(item => item instanceof CounterspellModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    test('kirin-tor-mage-play', async () => {
        // Check initial stats
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.minions.length).toBe(1);
        expect(boardA.child.minions.length).toBe(0);
        expect(cardD.child.cost.state.current).toBe(3); // Ice Barrier normal cost
        expect(cardE.child.cost.state.current).toBe(3); // Counterspell normal cost

        // Play Kirin Tor Mage
        const promise = cardC.play();
        SelectUtil.set(0);
        await promise;

        // Check deployment and mana consumption
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 cost
        expect(handA.child.minions.length).toBe(0);
        expect(boardA.child.minions.length).toBe(1);
        expect(boardA.child.minions[0]).toBe(cardC);
    })

    test('ice-barrier-cast', async () => {
        // Check that secrets now cost 0
        expect(cardD.child.cost.state.current).toBe(0); // Ice Barrier should cost 0
        expect(cardE.child.cost.state.current).toBe(0); // Counterspell should still cost 3

        // Play Ice Barrier (should cost 0)
        await cardD.play();

        expect(playerA.child.mana.state.current).toBe(7); // Mana unchanged (0 cost)
        expect(handA.child.spells.length).toBe(1); // Only Counterspell left
    })

    test('second-secret-normal-cost', async () => {
        // Check that the second secret now costs normal amount
        expect(cardE.child.cost.state.current).toBe(3); // Counterspell should cost normal 3

        // Play Counterspell (should cost normal 3)
        await cardE.play();

        expect(playerA.child.mana.state.current).toBe(4); // 7 - 3 = 4
        expect(handA.child.spells.length).toBe(0); // No spells left
        expect(boardA.child.secrets.length).toBe(2)
    })
})

