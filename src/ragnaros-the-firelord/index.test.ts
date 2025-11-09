/**
 * Test cases for Ragnaros the Firelord
 * 
 * Initial state: Player A has Ragnaros the Firelord in hand.
 * Player B has no minions on board.
 * 
 * 1. ragnaros-the-firelord-play: Player A plays Ragnaros the Firelord.
 * 2. turn-end: At the end of Player A's turn, Ragnaros deals 8 damage to Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { RagnarosTheFirelordModel } from "./index";
import { boot } from "../boot";

describe('ragnaros-the-firelord', () => {
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
                            cards: [new RagnarosTheFirelordModel()]
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
                            cards: []
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
    const handA = playerA.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof RagnarosTheFirelordModel);
    const heroB = playerB.child.hero;
    if (!cardC) throw new Error();

    test('turn-end', async () => {
        game.child.turn.next();
        expect(heroB.child.health.state.current).toBe(30);
        game.child.turn.next();
    })

    test('ragnaros-the-firelord-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(8); // Ragnaros: 8/8
        expect(cardC.child.health.state.current).toBe(8);
        expect(handA.child.cards.length).toBe(1); // Ragnaros in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Ragnaros the Firelord
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Ragnaros should be on board
        expect(boardA.child.cards.length).toBe(1); // Ragnaros on board
        expect(handA.child.cards.length).toBe(0); // Ragnaros moved to board
        expect(playerA.child.mana.state.current).toBe(2); // 10 - 8 = 2

        // Get Ragnaros from board
        const ragnarosOnBoard = boardA.child.cards.find(item => item instanceof RagnarosTheFirelordModel);
        if (!ragnarosOnBoard) throw new Error();

        // Check that Ragnaros cannot attack
        expect(ragnarosOnBoard.child.action.state.isLock).toBe(true); // Cannot attack
        expect(ragnarosOnBoard.child.action.status).toBe(false); // Action is disabled
    });

    test('turn-end', async () => {
        // Check initial state
        expect(heroB.child.health.state.current).toBe(30); // Player B hero: 30 health
        expect(boardA.child.cards.length).toBe(1); // Ragnaros on board

        // End Player A's turn - Ragnaros should deal 8 damage to Player B's hero
        game.child.turn.next();

        // Check that Player B's hero took 8 damage
        expect(heroB.child.health.state.current).toBe(22); // 30 - 8 = 22
    });
});
