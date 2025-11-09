/**
 * Test cases for Lord of the Arena
 * 
 * Initial state: Player A has Lord of the Arena in hand.
 * Player B has a minion on board.
 * 
 * 1. lord-arena-play: Player A plays Lord of the Arena.
 * 2. wisp-attack: Player B's Wisp cannot attack Player A's hero due to Lord of the Arena's Taunt.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { LordOfTheArenaModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('lord-of-the-arena', () => {
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
                            cards: [new LordOfTheArenaModel()]
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
    const cardC = handA.child.cards.find(item => item instanceof LordOfTheArenaModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const heroA = playerA.child.hero;

    test('lord-arena-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(6); // Lord of the Arena: 6/5
        expect(cardC.child.health.state.current).toBe(5);
        expect(handA.child.cards.length).toBe(1); // Lord of the Arena in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Lord of the Arena
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Lord of the Arena should be on board
        expect(boardA.child.cards.length).toBe(1); // Lord of the Arena on board
        expect(handA.child.cards.length).toBe(0); // Lord of the Arena moved to board
        expect(playerA.child.mana.state.current).toBe(4); // 10 - 6 = 4
    });

    test('wisp-attack', async () => {
        const turn = game.child.turn;
        turn.next();
        expect(turn.refer.current).toBe(playerB);

        // Check that Wisp cannot attack hero due to Lord of the Arena's Taunt
        expect(boardA.child.cards.length).toBe(1); // Lord of the Arena on board
        expect(boardB.child.cards.length).toBe(1); // Wisp on board
        expect(cardD.child.attack.state.current).toBe(1); // Wisp: 1/1
        expect(cardD.child.health.state.current).toBe(1);

        // Try to attack with Wisp
        const promise = cardD.child.action.run();
        expect(playerB.child.controller.current?.options).not.toContain(heroA); // Cannot target enemy hero (Taunt blocks)
        expect(playerB.child.controller.current?.options).toContain(cardC); // Must target Lord of the Arena due to Taunt
        playerB.child.controller.set(cardC); // Target Lord of the Arena
        await promise;

        // Lord of the Arena should take 1 damage
        expect(cardC.child.health.state.current).toBe(4); // 5 - 1 = 4
    });
});
