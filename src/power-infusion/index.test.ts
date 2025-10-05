/**
 * Test cases for Power Infusion
 * 
 * Initial state: Player A has Power Infusion in hand.
 * Player A has a minion on board.
 * 
 * 1. power-infusion-cast: Player A casts Power Infusion on a minion, giving it +2/+6.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { PowerInfusionModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('power-infusion', () => {
    const game = new GameModel(() => ({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { 
                            minions: [new WispModel()]
                        }
                    })),
                    hand: new HandModel(() => ({
                        child: { 
                            minions: [],
                            spells: [new PowerInfusionModel()]
                        }
                    })),
                    deck: new DeckModel(() => ({
                        child: { minions: [] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { 
                            minions: []
                        }
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
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const handA = playerA.child.hand;
    const cardC = handA.child.spells.find(item => item instanceof PowerInfusionModel);
    const cardD = boardA.child.minions.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleD = cardD.child.role;

    test('power-infusion-cast', async () => {
        // Check initial state
        expect(roleD.child.attack.state.current).toBe(1); // Wisp: 1/1
        expect(roleD.child.health.state.current).toBe(1);
        expect(handA.child.spells.length).toBe(1); // Power Infusion in hand
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Cast Power Infusion on Wisp
        let promise = cardC.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleD);
        SelectUtil.set(roleD);
        await promise;

        // Wisp should have +2/+6 buff
        expect(roleD.child.attack.state.current).toBe(3); // 1 + 2 = 3
        expect(roleD.child.health.state.current).toBe(7); // 1 + 6 = 7

        // Power Infusion should be consumed
        expect(handA.child.spells.length).toBe(0); // Power Infusion consumed
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6
    });
});
