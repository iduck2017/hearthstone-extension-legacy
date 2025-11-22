/**
 * Test cases for Bluegill Warrior
 * 
 * Initial state: Player A has Bluegill Warrior in hand.
 * Player B has a Wisp on board.
 * 
 * 1. bluegill-warrior-play: Player A plays Bluegill Warrior.
 * 2. bluegill-warrior-charge: Player A's Bluegill Warrior immediately attacks Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { BluegillWarriorModel } from "./index";
import { WispModel } from '../../neutral/wisp';
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

    test('bluegill-warrior-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(2); // Bluegill Warrior: 2/1
        expect(cardC.child.health.state.current).toBe(1);
        expect(handA.child.cards.length).toBe(1); // Bluegill Warrior in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Bluegill Warrior
        let promise = cardC.play();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Bluegill Warrior should be on board
        expect(boardA.child.cards.length).toBe(1); // Bluegill Warrior on board
        expect(handA.child.cards.length).toBe(0); // Bluegill Warrior moved to board
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 = 8

        // Check that Bluegill Warrior has Charge (can attack immediately)
        expect(cardC.child.action.state.current).toBe(1); // Can attack
        expect(cardC.child.action.status).toBe(true); // Action is available
    });

    test('bluegill-warrior-charge', async () => {
        // Check initial state
        expect(heroB.child.health.state.current).toBe(30); // Player B hero: 30 health
        expect(cardC.child.attack.state.current).toBe(2); // Bluegill Warrior: 2/1
        expect(cardC.child.health.state.current).toBe(1);
        expect(cardC.child.action.state.current).toBe(1); // Can attack
        expect(cardC.child.action.status).toBe(true); // Action is available

        // Bluegill Warrior attacks Player B's hero
        const promise = cardC.child.action.run();
        expect(playerA.controller.current?.options).toContain(heroB); // Can target enemy hero
        expect(playerA.controller.current?.options).toContain(cardD); // Can target enemy minion
        playerA.controller.set(heroB); // Target Player B's hero
        await promise;

        // Player B's hero should take 2 damage
        expect(heroB.child.health.state.current).toBe(28); // 30 - 2 = 28
        expect(heroB.child.health.state.damage).toBe(2);

        // Bluegill Warrior should have used its attack
        expect(cardC.child.action.state.current).toBe(0); // Cannot attack again this turn
    });
});
