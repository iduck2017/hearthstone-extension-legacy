/**
 * Test cases for Charge
 * 
 * 1. initial-state: Player A has Wisp and Charge in hand. Player B has Wisp on board.
 * 2. wisp-play:
 *    - Player A summons Wisp
 *    - Assert: Wisp is on Player A's board
 *    - Assert: Wisp's attack is 1
 *    - Assert: Wisp is in sleep state, cannot attack
 * 3. charge-cast:
 *    - Player A uses Charge
 *    - Assert: Targets do not include Player A and Player B
 *    - Assert: Targets do not include Wisp on Player B's board
 *    - Assert: Targets include Wisp on Player A's board
 *    - Select target Wisp on Player A's board
 *    - Assert: Wisp's attack is 3
 *    - Assert: Wisp has Charge
 *    - Assert: Wisp can attack immediately
 * 4. wisp-attack:
 *    - Wisp attacks Player B
 *    - Assert: Player B's health is 27
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { ChargeModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";

describe('charge', () => {
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
                            cards: [new WispModel(), new ChargeModel()]
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
    const handA = playerA.child.hand;
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;
    
    const cardC = handA.child.cards.find(item => item instanceof WispModel);
    const cardD = handA.child.cards.find(item => item instanceof ChargeModel);
    const cardE = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    // initial-state: Player A has Wisp and Charge in hand. Player B has Wisp on board.

    test('wisp-play', async () => {
        // Player A summons Wisp
        let promise = cardC.play();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Assert: Wisp is on Player A's board
        expect(boardA.child.cards).toContain(cardC);
        
        // Assert: Wisp's attack is 1
        expect(cardC.child.attack.state.current).toBe(1);
        
        // Assert: Wisp is in sleep state, cannot attack
        expect(cardC.child.action.state.isReady).toBe(false);
    });

    test('charge-cast', async () => {
        // Player A uses Charge
        let promise = cardD.play();
        await CommonUtil.sleep();
        
        // Assert: Targets do not include Player A and Player B
        const selector = playerA.controller.current;
        expect(selector?.options).not.toContain(heroA);
        expect(selector?.options).not.toContain(heroB);
        
        // Assert: Targets do not include Wisp on Player B's board
        expect(selector?.options).not.toContain(cardE);
        
        // Assert: Targets include Wisp on Player A's board
        expect(selector?.options).toContain(cardC);
        
        // Select target Wisp on Player A's board
        playerA.controller.set(cardC);
        await promise;

        // Assert: Wisp's attack is 3
        expect(cardC.child.attack.state.current).toBe(3);
        
        // Assert: Wisp has Charge
        expect(cardC.child.charge.state.isEnabled).toBe(true);
        
        // Assert: Wisp can attack immediately
        expect(cardC.child.action.state.isReady).toBe(true);
    });

    test('wisp-attack', async () => {
        // Wisp attacks Player B
        let promise = cardC.child.action.run();
        playerA.controller.set(heroB); // Target Player B's hero
        await promise;

        // Assert: Player B's health is 27
        expect(heroB.child.health.state.current).toBe(27);
    });
});

