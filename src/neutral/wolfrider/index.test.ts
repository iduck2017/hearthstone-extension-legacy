/**
 * Test cases for Wolfrider
 * 
 * 1. initial-state:
 *    - Player A has Wolfrider in hand
 *    - Player B has Wisp (1/1) on board
 *    - Player B hero health 30
 * 2. wolfrider-play:
 *    - Player A summons Wolfrider
 *    - Assert: Wolfrider has Charge
 *    - Assert: Wolfrider can attack immediately
 * 3. wolfrider-attack:
 *    - Wolfrider attacks Player B's Wisp
 *    - Assert: Can target enemy hero
 *    - Assert: Can target enemy minion
 *    - Assert: Wisp is destroyed
 *    - Assert: Wolfrider is destroyed
 *    - Assert: Wolfrider's action is consumed
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { WolfriderModel } from "./index";
import { WispModel } from '../wisp';
import { boot } from '../../boot';

describe('wolfrider', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: []
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new WolfriderModel()]
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
                        child: { 
                            cards: []
                        }
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
    const cardC = handA.child.cards.find(item => item instanceof WolfriderModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;

    // initial-state:
    // - Player A has Wolfrider in hand
    // - Player B has Wisp (1/1) on board
    // - Player B hero health 30

    test('wolfrider-play', async () => {
        // Player A summons Wolfrider
        let promise = cardC.play();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Assert: Wolfrider has Charge
        expect(cardC.child.charge.state.isEnabled).toBe(true);
        
        // Assert: Wolfrider can attack immediately
        expect(cardC.child.action.state.isReady).toBe(true);
    });

    test('wolfrider-attack', async () => {
        // Wolfrider attacks Player B's Wisp
        let promise = cardC.child.action.run();
        
        // Assert: Can target enemy hero
        expect(playerA.controller.current?.options).toContain(heroB);
        
        // Assert: Can target enemy minion
        expect(playerA.controller.current?.options).toContain(cardD);
        
        playerA.controller.set(cardD); // Target Wisp
        await promise;

        // Assert: Wisp is destroyed
        expect(cardD.child.dispose.state.isActived).toBe(true);
        
        // Assert: Wolfrider is destroyed
        expect(cardC.child.dispose.state.isActived).toBe(true);
        
        // Assert: Wolfrider's action is consumed
        expect(cardC.child.action.state.current).toBe(0);
    });
});
