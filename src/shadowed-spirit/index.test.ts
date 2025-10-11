/**
 * Test cases for Shadowed Spirit
 * 
 * Initial state: Player A has Shadowed Spirit on board.
 * Player B has a hero with full health.
 * 
 * 1. shadowed-spirit-death: Player A's Shadowed Spirit dies, dealing 3 damage to Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { ShadowedSpiritModel } from "./index";
import { WaterElementalModel } from "../water-elemental";
import { boot } from "../boot";

describe('shadowed-spirit', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            minions: [new ShadowedSpiritModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            minions: [],
                            spells: []
                        }
                    }),
                    deck: new DeckModel({
                        child: { minions: [] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            minions: [new WaterElementalModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { spells: [] }
                    })
                }
            })
        }
    });
    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const cardC = boardA.child.minions.find(item => item instanceof ShadowedSpiritModel);
    const cardD = boardB.child.minions.find(item => item instanceof WaterElementalModel);
    if (!cardC || !cardD) throw new Error();
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;
    const heroB = playerB.child.hero;
    const roleB = heroB.child.role;

    test('shadowed-spirit-death', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(4); // Shadowed Spirit: 3/4
        expect(roleC.child.health.state.current).toBe(3);
        expect(roleD.child.attack.state.current).toBe(3); // Water Elemental: 3/6
        expect(roleD.child.health.state.current).toBe(6);
        expect(roleB.child.health.state.current).toBe(30); // Full health

        // Shadowed Spirit attacks Water Elemental, Shadowed Spirit dies
        let promise = roleC.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleD);
        SelectUtil.set(roleD);
        await promise;

        // Shadowed Spirit should die, Water Elemental should survive
        expect(cardC.child.dispose.status).toBe(true);
        expect(cardD.child.dispose.status).toBe(false);
        expect(boardA.child.minions.length).toBe(0);
        expect(boardB.child.minions.length).toBe(1);

        // Enemy hero should take 3 damage from Shadowed Spirit's deathrattle
        expect(roleB.child.health.state.current).toBe(27); // 30 - 3 = 27
    });
});