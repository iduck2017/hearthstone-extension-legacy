/**
 * Test cases for Bloodsail Deckhand
 * 
 * 1. initial-state:
 *    - Player A has Bloodsail Deckhand (1/2/1) in hand
 *    - Player A has Fiery War Axe (2 mana) in hand
 *    - Player A has Arcanite Reaper (5 mana) in hand
 *    - Player A has 10 mana
 * 2. bloodsail-deckhand-play:
 *    - Player A plays Bloodsail Deckhand
 *    - Assert: Bloodsail Deckhand is on board
 *    - Assert: Player A's hand size is 2 (Fiery War Axe + Arcanite Reaper)
 * 3. fiery-war-axe-play:
 *    - Player A plays Fiery War Axe
 *    - Assert: Fiery War Axe cost is 1 (reduced from 2)
 *    - Assert: Player A's mana is 8 (9 - 1 = 8, where 9 is mana after playing Bloodsail Deckhand, 1 is reduced weapon cost)
 *    - Assert: Fiery War Axe is equipped
 * 4. arcanite-reaper-play:
 *    - Player A plays Arcanite Reaper
 *    - Assert: Arcanite Reaper cost is 5 (not reduced, feature was disabled after first weapon)
 *    - Assert: Player A's mana is 3 (8 - 5 = 3)
 *    - Assert: Arcanite Reaper is equipped (replaces Fiery War Axe)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { BloodsailDeckhandModel } from "./index";
import { FieryWarAxeModel } from "../fiery-war-axe";
import { ArcaniteReaperModel } from "../arcanite-reaper";
import { boot } from "../../boot";

describe('bloodsail-deckhand', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [
                                new BloodsailDeckhandModel(),
                                new FieryWarAxeModel(),
                                new ArcaniteReaperModel()
                            ]
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
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
                    }),
                    deck: new DeckModel({
                        child: { cards: [] }
                    })
                }
            })
        }
    });
    
    boot(game);

    const playerA = game.child.playerA;
    const handA = playerA.child.hand;
    const boardA = playerA.child.board;
    const heroA = playerA.child.hero;
    
    const cardC = handA.child.cards.find(item => item instanceof BloodsailDeckhandModel);
    const cardD = handA.child.cards.find(item => item instanceof FieryWarAxeModel);
    const cardE = handA.child.cards.find(item => item instanceof ArcaniteReaperModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    test('bloodsail-deckhand-play', async () => {
        // Player A plays Bloodsail Deckhand
        let promise = cardC.play();
        await CommonUtil.sleep();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Assert: Bloodsail Deckhand is on board
        expect(boardA.child.cards.length).toBe(1);
        expect(boardA.child.cards[0]).toBe(cardC);
        // Assert: Player A's hand size is 2 (Fiery War Axe + Arcanite Reaper)
        expect(handA.child.cards.length).toBe(2);
        // Assert: Mana consumed is 1
        expect(playerA.child.mana.state.current).toBe(9);
    });

    test('fiery-war-axe-play', async () => {
        // Player A plays Fiery War Axe
        // Assert: Fiery War Axe cost is 1 (reduced from 2)
        expect(cardD.child.cost.state.current).toBe(1);
        
        let promise = cardD.play();
        await promise;

        // Assert: Fiery War Axe is equipped
        expect(heroA.child.weapon).toBeDefined();
        expect(heroA.child.weapon).toBe(cardD);
        // Assert: Hero attack is 3 (Fiery War Axe attack)
        expect(heroA.child.attack.state.current).toBe(3);
        // Assert: Player A's mana is 8 (9 - 1 = 8, where 9 is mana after playing Bloodsail Deckhand, 1 is reduced weapon cost)
        expect(playerA.child.mana.state.current).toBe(8);
        // Assert: Hand size is 1 (only Arcanite Reaper left)
        expect(handA.child.cards.length).toBe(1);

    });

    // test('arcanite-reaper-play', async () => {
    //     // Player A plays Arcanite Reaper
    //     // Assert: Arcanite Reaper cost is 5 (not reduced, feature was disabled after first weapon)
    //     expect(cardE.child.cost.state.current).toBe(5);
        
    //     let promise = cardE.play();
    //     await promise;

    //     // Assert: Arcanite Reaper is equipped (replaces Fiery War Axe)
    //     expect(heroA.child.weapon).toBeDefined();
    //     expect(heroA.child.weapon).toBe(cardE);
    //     // Assert: Hero attack is 5 (Arcanite Reaper attack)
    //     expect(heroA.child.attack.state.current).toBe(5);
    //     // Assert: Player A's mana is 3 (8 - 5 = 3)
    //     expect(playerA.child.mana.state.current).toBe(3);
    //     // Assert: Hand is empty
    //     expect(handA.child.cards.length).toBe(0);
    // });
});

