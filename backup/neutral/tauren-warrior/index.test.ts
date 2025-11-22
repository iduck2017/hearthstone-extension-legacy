/**
 * Test cases for Tauren Warrior
 * 
 * Initial state: Player A has Tauren Warrior in hand.
 * Player B has a Wisp on board.
 * 
 * 1. tauren-warrior-play: Player A plays Tauren Warrior.
 * 2. tauren-warrior-attack: Player A's Tauren Warrior attacks Player B's Wisp, gaining +3 Attack.
 * 3. wisp-attack: Player B's Wisp attacks Tauren Warrior, can only target Tauren Warrior (Taunt).
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { TaurenWarriorModel } from "./index";
import { WispModel } from '../../neutral/wisp';
import { boot } from '../../boot';

describe('tauren-warrior', () => {
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
                            cards: [new TaurenWarriorModel()]
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
    const cardC = handA.child.cards.find(item => item instanceof TaurenWarriorModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const heroA = playerA.child.hero;

    test('tauren-warrior-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(2); // Tauren Warrior: 2/3
        expect(cardC.child.health.state.current).toBe(3);
        expect(handA.child.cards.length).toBe(1); // Tauren Warrior in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Tauren Warrior
        let promise = cardC.play();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Tauren Warrior should be on board
        expect(boardA.child.cards.length).toBe(1); // Tauren Warrior on board
        expect(handA.child.cards.length).toBe(0); // Tauren Warrior moved to board
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 = 7

        // Check that Tauren Warrior has Taunt
        expect(cardC.child.feats.child.taunt).toBeDefined(); // Has Taunt
    });

    test('wisp-attack', async () => {
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(cardC.child.attack.state.current).toBe(2); // Tauren Warrior: 2/3
        expect(cardD.child.health.state.current).toBe(1); // Wisp: 1/1
        expect(boardA.child.cards.length).toBe(1); // Tauren Warrior on board
        expect(boardB.child.cards.length).toBe(1); // Wisp on board

        // Player B's Wisp attacks Player A's Tauren Warrior
        let promise = cardD.child.action.run();
        expect(playerB.controller.current?.options).toContain(cardC); // Can target Tauren Warrior (Taunt)
        expect(playerB.controller.current?.options).not.toContain(heroA); // Cannot target Player A's hero (Taunt blocks)
        playerB.controller.set(cardC); // Target Tauren Warrior
        await promise;

        // Wisp should die (2/3 vs 1/1)
        expect(boardB.child.cards.length).toBe(0); // Wisp dies
        expect(cardD.child.dispose.status).toBe(true);
        
        // Tauren Warrior should be damaged and gain +3 Attack
        expect(cardC.child.health.state.current).toBe(2); // 3 - 1 = 2
        expect(cardC.child.health.state.damage).toBe(1);
        expect(cardC.child.attack.state.current).toBe(5); // 2 + 3 = 5 (enraged)
    });
});
