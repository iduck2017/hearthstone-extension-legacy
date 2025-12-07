/**
 * Test cases for Voidwalker
 * 
 * 1. initial-state:
 *    - Player A has Voidwalker in hand
 *    - Player A has no minions on board
 *    - Player B has Wisp (1/1) on board
 * 2. voidwalker-play:
 *    - Player A plays Voidwalker
 *    - Assert: Voidwalker is on board (1/3)
 *    - Assert: Voidwalker has Taunt
 * 3. wisp-attack:
 *    - Turn switches to Player B
 *    - Player B's Wisp attacks
 *    - Assert: Can only target Voidwalker (Taunt forces this)
 *    - Assert: Cannot target Player A's hero (Taunt blocks)
 *    - Wisp attacks Voidwalker
 *    - Assert: Voidwalker health is 2 (3 - 1 = 2)
 *    - Assert: Wisp health is 0 (1 - 1 = 0, dies)
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { VoidwalkerModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";

describe('voidwalker', () => {
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
                            cards: [new VoidwalkerModel()]
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
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    const turn = game.child.turn;
    
    const cardC = handA.child.cards.find(item => item instanceof VoidwalkerModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const heroA = playerA.child.hero;

    test('voidwalker-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(1); // Voidwalker: 1/3
        expect(cardC.child.health.state.current).toBe(3);
        expect(handA.child.cards.length).toBe(1); // Voidwalker in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board

        // Player A plays Voidwalker
        let promise = cardC.play();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Assert: Voidwalker is on board (1/3)
        expect(boardA.child.cards.length).toBe(1); // Voidwalker on board
        expect(handA.child.cards.length).toBe(0); // Voidwalker moved to board
        expect(cardC.child.attack.state.current).toBe(1);
        expect(cardC.child.health.state.current).toBe(3);

        // Assert: Voidwalker has Taunt
        expect(cardC.child.taunt).toBeDefined(); // Has Taunt
    });

    test('wisp-attack', async () => {
        // Turn to Player B
        turn.next();
        expect(turn.refer.current).toBe(playerB);

        // Check initial state
        expect(cardC.child.health.state.current).toBe(3); // Voidwalker: 1/3
        expect(cardD.child.health.state.current).toBe(1); // Wisp: 1/1
        expect(boardA.child.cards.length).toBe(1); // Voidwalker on board
        expect(boardB.child.cards.length).toBe(1); // Wisp on board

        // Player B's Wisp attacks - should be forced to target Voidwalker due to Taunt
        let promise = cardD.child.action.run();
        // Assert: Can only target Voidwalker (Taunt forces this)
        expect(playerB.controller.current?.options).toContain(cardC);
        // Assert: Cannot target Player A's hero (Taunt blocks)
        expect(playerB.controller.current?.options).not.toContain(heroA);
        playerB.controller.set(cardC); // Target Voidwalker
        await promise;

        // Assert: Voidwalker health is 2 (3 - 1 = 2)
        expect(cardC.child.health.state.current).toBe(2);
        // Assert: Wisp health is 0 (1 - 1 = 0, dies)
        expect(cardD.child.health.state.current).toBe(0);
        expect(boardB.child.cards.length).toBe(0); // Wisp dies
    });
});

