/**
 * Test cases for Sen'jin Shieldmasta
 * 
 * Initial state: Player A has Sen'jin Shieldmasta in hand.
 * Player B has a Wisp on board.
 * 
 * 1. senjin-shieldmasta-play: Player A plays Sen'jin Shieldmasta.
 * 2. taunt-test: Player B's Wisp must attack Sen'jin Shieldmasta due to Taunt.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { SenjinShieldmastaModel } from "./index";
import { WispModel } from '../../neutral/wisp';
import { boot } from '../../boot';

describe('senjin-shieldmasta', () => {
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
                            cards: [new SenjinShieldmastaModel()]
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
    const cardC = handA.child.cards.find(item => item instanceof SenjinShieldmastaModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const heroA = playerA.child.hero;

    test('senjin-shieldmasta-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(3); // Sen'jin Shieldmasta: 3/5
        expect(cardC.child.health.state.current).toBe(5);
        expect(handA.child.cards.length).toBe(1); // Sen'jin Shieldmasta in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Sen'jin Shieldmasta
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Sen'jin Shieldmasta should be on board
        expect(boardA.child.cards.length).toBe(1); // Sen'jin Shieldmasta on board
        expect(handA.child.cards.length).toBe(0); // Sen'jin Shieldmasta moved to board
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6

        // Check that Sen'jin Shieldmasta has Taunt
        expect(cardC.child.feats.child.taunt).toBeDefined(); // Has Taunt
    });

    test('taunt-test', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(cardC.child.health.state.current).toBe(5); // Sen'jin Shieldmasta: 3/5
        expect(cardD.child.health.state.current).toBe(1); // Wisp: 1/1
        expect(boardA.child.cards.length).toBe(1); // Sen'jin Shieldmasta on board
        expect(boardB.child.cards.length).toBe(1); // Wisp on board

        // Player B's Wisp attacks - should be forced to target Sen'jin Shieldmasta due to Taunt
        let promise = cardD.child.action.run();
        expect(playerB.child.controller.current?.options).toContain(cardC); // Can target Sen'jin Shieldmasta (Taunt)
        expect(playerB.child.controller.current?.options).not.toContain(heroA); // Cannot target Player A's hero (Taunt blocks)
        playerB.child.controller.set(cardC); // Target Sen'jin Shieldmasta
        await promise;

        // Both minions should take damage
        expect(cardC.child.health.state.current).toBe(4); // Sen'jin Shieldmasta: 5 - 1 = 4
        expect(cardD.child.health.state.current).toBe(-2); // Wisp: 1 - 3 = 0 (dies)
        expect(boardB.child.cards.length).toBe(0); // Wisp dies
    });
});
