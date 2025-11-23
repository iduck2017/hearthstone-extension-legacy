/**
 * Test cases for Kor'kron Elite
 * 
 * 1. initial-state:
 *    - Player A has Kor'kron Elite in hand
 *    - Player B has Wisp (1/1) on board
 *    - Player B hero health 30
 * 2. korkron-elite-play:
 *    - Player A summons Kor'kron Elite
 *    - Assert: Kor'kron Elite is on Player A's board
 *    - Assert: Kor'kron Elite's attack is 4
 *    - Assert: Kor'kron Elite's health is 3
 *    - Assert: Kor'kron Elite has Charge
 *    - Assert: Kor'kron Elite can attack immediately
 * 3. korkron-elite-attack:
 *    - Kor'kron Elite attacks Player B's hero
 *    - Assert: Player B's hero health is 26
 *    - Assert: Kor'kron Elite's action is consumed
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { KorkronEliteModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";

describe('korkron-elite', () => {
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
                            cards: [new KorkronEliteModel()]
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
    const handA = playerA.child.hand;
    const heroB = playerB.child.hero;
    
    const cardC = handA.child.cards.find(item => item instanceof KorkronEliteModel);
    if (!cardC) throw new Error();

    // initial-state:
    // - Player A has Kor'kron Elite in hand
    // - Player B has Wisp (1/1) on board
    // - Player B hero health 30

    test('korkron-elite-play', async () => {
        // Player A summons Kor'kron Elite
        let promise = cardC.play();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Assert: Kor'kron Elite has Charge
        expect(cardC.child.charge.state.isEnabled).toBe(true);
        
        // Assert: Kor'kron Elite can attack immediately
        expect(cardC.child.action.state.isReady).toBe(true);
    });

    test('korkron-elite-attack', async () => {
        const cardD = playerB.child.board.child.cards.find(item => item instanceof WispModel);
        if (!cardD) throw new Error();

        // Kor'kron Elite attacks Player B's hero
        let promise = cardC.child.action.run();
        
        // Assert: Can target enemy hero
        expect(playerA.controller.current?.options).toContain(heroB);
        
        // Assert: Can target enemy minion
        expect(playerA.controller.current?.options).toContain(cardD);
        
        playerA.controller.set(heroB); // Target Player B's hero
        await promise;

        // Assert: Player B's hero health is 26
        expect(heroB.child.health.state.current).toBe(26);
        
        // Assert: Kor'kron Elite's action is consumed
        expect(cardC.child.action.state.current).toBe(0);
    });
});

