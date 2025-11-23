/**
 * Test cases for Bluegill Warrior
 * 
 * 1. initial-state:
 *    - Player A has Bluegill Warrior in hand
 *    - Player B has Wisp (1/1) on board
 *    - Player B hero health 30
 * 2. bluegill-warrior-play:
 *    - Player A summons Bluegill Warrior
 *    - Assert: Bluegill Warrior has Charge
 *    - Assert: Bluegill Warrior can attack immediately
 * 3. bluegill-warrior-attack:
 *    - Bluegill Warrior attacks Player B's hero
 *    - Assert: Can target enemy hero
 *    - Assert: Can target enemy minion
 *    - Assert: Player B's hero health is 28
 *    - Assert: Bluegill Warrior's action is consumed
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { BluegillWarriorModel } from "./index";
import { WispModel } from '../wisp';
import { boot } from '../../boot';

describe('bluegill-warrior', () => {
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
                            cards: [new BluegillWarriorModel()]
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
    const cardC = handA.child.cards.find(item => item instanceof BluegillWarriorModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const heroB = playerB.child.hero;

    // initial-state:
    // - Player A has Bluegill Warrior in hand
    // - Player B has Wisp (1/1) on board
    // - Player B hero health 30

    test('bluegill-warrior-play', async () => {
        // Player A summons Bluegill Warrior
        let promise = cardC.play();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Assert: Bluegill Warrior has Charge
        expect(cardC.child.charge.state.isEnabled).toBe(true);
        
        // Assert: Bluegill Warrior can attack immediately
        expect(cardC.child.action.state.isReady).toBe(true);
    });

    test('bluegill-warrior-attack', async () => {
        // Bluegill Warrior attacks Player B's hero
        let promise = cardC.child.action.run();
        
        // Assert: Can target enemy hero
        expect(playerA.controller.current?.options).toContain(heroB);
        
        // Assert: Can target enemy minion
        expect(playerA.controller.current?.options).toContain(cardD);
        
        playerA.controller.set(heroB); // Target Player B's hero
        await promise;

        // Assert: Player B's hero health is 28
        expect(heroB.child.health.state.current).toBe(28);
        
        // Assert: Bluegill Warrior's action is consumed
        expect(cardC.child.action.state.current).toBe(0);
    });
});
