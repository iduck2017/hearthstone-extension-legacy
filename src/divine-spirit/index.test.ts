/**
 * Test cases for Divine Spirit
 * 
 * Initial state: Player A has Divine Spirit in hand.
 * Player A has Water Elemental (3/6) on board.
 * 
 * 1. divine-spirit-cast: Player A uses Divine Spirit on Water Elemental, doubles its Health.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil } from "hearthstone-core";
import { DivineSpiritModel } from "./index";
import { WaterElementalModel } from "../water-elemental";
import { boot } from "../boot";

describe('divine-spirit', () => {
    const game = new GameModel(() => ({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { 
                            minions: [new WaterElementalModel()]
                        }
                    })),
                    hand: new HandModel(() => ({
                        child: { 
                            minions: [],
                            spells: [new DivineSpiritModel()]
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
    const boardA = playerA.child.board;
    const handA = playerA.child.hand;
    const cardC = handA.child.spells.find(item => item instanceof DivineSpiritModel);
    const cardD = boardA.child.minions.find(item => item instanceof WaterElementalModel);
    if (!cardC || !cardD) throw new Error();
    const roleD = cardD?.child.role;

    test('divine-spirit-cast', async () => {
        // Check initial state
        expect(roleD.child.attack.state.current).toBe(3); // Water Elemental: 3/6
        expect(roleD.child.health.state.current).toBe(6);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.refer.order.length).toBe(1);

        // Player A uses Divine Spirit on Water Elemental
        const promise = cardC.play();
        expect(SelectUtil.current?.options).toContain(cardD.child.role); // Water Elemental should be targetable
        SelectUtil.set(cardD.child.role);
        await promise;

        // Water Elemental should have doubled Health
        expect(roleD.child.attack.state.current).toBe(3); // Attack unchanged
        expect(roleD.child.health.state.current).toBe(12); // 6 + 6 = 12 (doubled)

        // Divine Spirit should be consumed
        expect(handA.refer.order.length).toBe(0); // Divine Spirit consumed
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 cost
    });
});
