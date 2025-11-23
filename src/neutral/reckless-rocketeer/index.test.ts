/**
 * Test cases for Reckless Rocketeer
 * 
 * 1. initial-state:
 *    - Player A has Reckless Rocketeer in hand
 *    - Player B has Wisp (1/1) on board
 *    - Player B hero health 30
 * 2. reckless-rocketeer-play:
 *    - Player A summons Reckless Rocketeer
 *    - Assert: Reckless Rocketeer has Charge
 *    - Assert: Reckless Rocketeer can attack immediately
 * 3. reckless-rocketeer-attack:
 *    - Reckless Rocketeer attacks Player B's hero
 *    - Assert: Can target enemy hero
 *    - Assert: Can target enemy minion
 *    - Assert: Player B's hero health is 25
 *    - Assert: Reckless Rocketeer's action is consumed
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { RecklessRocketeerModel } from "./index";
import { WispModel } from '../wisp';
import { boot } from '../../boot';

describe('reckless-rocketeer', () => {
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
                            cards: [new RecklessRocketeerModel()]
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
                        child: { cards: [new WispModel()]}
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
    const cardC = handA.child.cards.find(item => item instanceof RecklessRocketeerModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const heroB = playerB.child.hero;

    // initial-state:
    // - Player A has Reckless Rocketeer in hand
    // - Player B has Wisp (1/1) on board
    // - Player B hero health 30

    test('reckless-rocketeer-play', async () => {
        // Player A summons Reckless Rocketeer
        let promise = cardC.play();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Assert: Reckless Rocketeer has Charge
        expect(cardC.child.charge.state.isEnabled).toBe(true);
        
        // Assert: Reckless Rocketeer can attack immediately
        expect(cardC.child.action.state.isReady).toBe(true);
    });

    test('reckless-rocketeer-attack', async () => {
        // Reckless Rocketeer attacks Player B's hero
        let promise = cardC.child.action.run();
        
        // Assert: Can target enemy hero
        expect(playerA.controller.current?.options).toContain(heroB);
        
        // Assert: Can target enemy minion
        expect(playerA.controller.current?.options).toContain(cardD);
        
        playerA.controller.set(heroB); // Target Player B's hero
        await promise;

        // Assert: Player B's hero health is 25
        expect(heroB.child.health.state.current).toBe(25);
        
        // Assert: Reckless Rocketeer's action is consumed
        expect(cardC.child.action.state.current).toBe(0);
    });
});
