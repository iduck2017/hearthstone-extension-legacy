/**
 * Test cases for Stranglethorn Tiger
 * 
 * Initial state: Player A has Stranglethorn Tiger in hand.
 * Player B has a Wisp on board.
 * 
 * 1. stranglethorn-tiger-play: Player A plays Stranglethorn Tiger.
 * 2. wisp-attack: Player B's Wisp attacks, can only target Player A's hero (Stranglethorn Tiger has Stealth).
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { StranglethornTigerModel } from "./index";
import { WispModel } from '../wisp';
import { boot } from '../../boot';

describe('stranglethorn-tiger', () => {
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
                            cards: [new StranglethornTigerModel()]
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
    const cardC = handA.child.cards.find(item => item instanceof StranglethornTigerModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const heroA = playerA.child.hero;

    test('stranglethorn-tiger-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(5); // Stranglethorn Tiger: 5/5
        expect(cardC.child.health.state.current).toBe(5);
        expect(handA.child.cards.length).toBe(1); // Stranglethorn Tiger in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Stranglethorn Tiger
        let promise = cardC.play();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Stranglethorn Tiger should be on board
        expect(boardA.child.cards.length).toBe(1); // Stranglethorn Tiger on board
        expect(handA.child.cards.length).toBe(0); // Stranglethorn Tiger moved to board
        expect(playerA.child.mana.state.current).toBe(5); // 10 - 5 = 5

        // Check that Stranglethorn Tiger has Stealth
        expect(cardC.child.stealth.state.isEnabled).toBe(true); // Has Stealth
    });

    test('wisp-attack', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(cardC.child.health.state.current).toBe(5); // Stranglethorn Tiger: 5/5
        expect(heroA.child.health.state.current).toBe(30); // Player A hero: 30 health
        expect(boardA.child.cards.length).toBe(1); // Stranglethorn Tiger on board
        expect(boardB.child.cards.length).toBe(1); // Wisp on board

        // Player B's Wisp attacks, can only target Player A's hero (Stranglethorn Tiger has Stealth)
        let promise = cardD.child.action.run();
        expect(playerB.controller.current?.options).toContain(heroA); // Can target Player A's hero
        expect(playerB.controller.current?.options).not.toContain(cardC); // Cannot target Stranglethorn Tiger (Stealth)
        playerB.controller.set(heroA); // Target Player A's hero
        await promise;

        // Player A's hero should take 1 damage
        expect(heroA.child.health.state.current).toBe(29); // Player A hero: 30 - 1 = 29
        expect(cardD.child.health.state.current).toBe(1); // Wisp: 1/1 (no damage)
    });
});
