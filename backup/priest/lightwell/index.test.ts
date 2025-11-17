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
import { WaterElementalModel } from "../../mage/water-elemental";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";

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
                            cards: [new WaterElementalModel(), new LightwellModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: []
                        }
                    }),
                    deck: new DeckModel({
                        child: { cards: [] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new WispModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
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
    const cardC = boardA.child.cards.find(item => item instanceof LightwellModel);
    const cardD = boardA.child.cards.find(item => item instanceof WaterElementalModel);
    const cardE = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    test('water-element-attack', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(0); // Lightwell: 0/5
        expect(cardC.child.health.state.current).toBe(5);
        expect(cardD.child.attack.state.current).toBe(3); // Water Elemental: 3/6
        expect(cardD.child.health.state.current).toBe(6);
        expect(cardE.child.attack.state.current).toBe(1); // Wisp: 1/1
        expect(cardE.child.health.state.current).toBe(1);
        // Water Elemental attacks Wisp
        const promise = cardD.child.action.run();
        playerA.child.controller.set(cardE);
        await promise;
        // Both should take damage
        expect(cardD.child.health.state.current).toBe(5); // 6 - 1 = 5, but Wisp deals 1 damage
        expect(cardE.child.health.state.current).toBe(-2); // 1 - 3 = -2, but minions die at 0
    });

    test('turn-end', async () => {
        // Player A's turn ends, Lightwell should restore 3 Health to a damaged character
        game.child.turn.next();
        // Water Elemental should be healed (it's the only damaged friendly character)
        expect(cardD.child.health.state.current).toBe(6); // 3 + 3 = 6 (back to full health)
    });
});
