/**
 * Test cases for Lightwell
 * 
 * Initial state: Player A has Lightwell and Water Elemental on board.
 * Player B has Wisp on board.
 * 
 * 1. water-element-attack: Player A's Water Elemental attacks Player B's Wisp, both take damage.
 * 2. turn-end: Player A's turn ends, Lightwell restores 3 Health to a damaged character.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { LightwellModel } from "./index";
import { WaterElementalModel } from "../water-elemental";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('lightwell', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            minions: [new WaterElementalModel(), new LightwellModel()]
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
                            minions: [new WispModel()]
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
    const cardC = boardA.child.minions.find(item => item instanceof LightwellModel);
    const cardD = boardA.child.minions.find(item => item instanceof WaterElementalModel);
    const cardE = boardB.child.minions.find(item => item instanceof WispModel);
    if (!cardC || !cardD || !cardE) throw new Error();
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;
    const roleE = cardE.child.role;

    test('water-element-attack', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(0); // Lightwell: 0/5
        expect(roleC.child.health.state.current).toBe(5);
        expect(roleD.child.attack.state.current).toBe(3); // Water Elemental: 3/6
        expect(roleD.child.health.state.current).toBe(6);
        expect(roleE.child.attack.state.current).toBe(1); // Wisp: 1/1
        expect(roleE.child.health.state.current).toBe(1);
        // Water Elemental attacks Wisp
        const promise = roleD.child.action.run();
        playerA.child.controller.set(roleE);
        await promise;
        // Both should take damage
        expect(roleD.child.health.state.current).toBe(5); // 6 - 1 = 5, but Wisp deals 1 damage
        expect(roleE.child.health.state.current).toBe(-2); // 1 - 3 = -2, but minions die at 0
    });

    test('turn-end', async () => {
        // Player A's turn ends, Lightwell should restore 3 Health to a damaged character
        game.child.turn.next();
        // Water Elemental should be healed (it's the only damaged friendly character)
        expect(roleD.child.health.state.current).toBe(6); // 3 + 3 = 6 (back to full health)
    });
});
