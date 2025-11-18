/**
 * Test cases for Magma Rager
 * 
 * Initial state: Player A has Magma Rager in hand.
 * Player B has empty board.
 * 
 * 1. magma-rager-play: Player A plays Magma Rager.
 * 2. magma-rager-attack: Player A's Magma Rager attacks Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { MagmaRagerModel } from "./index";
import { boot } from '../../boot';

describe('magma-rager', () => {
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
                            cards: [new MagmaRagerModel()]
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
    const handA = playerA.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof MagmaRagerModel);
    if (!cardC) throw new Error();

    test('magma-rager-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(5); // Magma Rager: 5/1
        expect(cardC.child.health.state.current).toBe(1);
        expect(handA.child.cards.length).toBe(1); // Magma Rager in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Magma Rager
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Magma Rager should be on board
        expect(boardA.child.cards.length).toBe(1); // Magma Rager on board
        expect(handA.child.cards.length).toBe(0); // Magma Rager moved to board
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 = 7
    });
});
