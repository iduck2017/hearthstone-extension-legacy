/**
 * Test cases for Chillwind Yeti
 * 
 * Initial state: Player A has Chillwind Yeti in hand.
 * Player B has empty board.
 * 
 * 1. chillwind-yeti-play: Player A plays Chillwind Yeti.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { ChillwindYetiModel } from "./index";
import { boot } from '../../boot';

describe('chillwind-yeti', () => {
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
                            cards: [new ChillwindYetiModel()]
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
    const cardC = handA.child.cards.find(item => item instanceof ChillwindYetiModel);
    if (!cardC) throw new Error();

    test('chillwind-yeti-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(4); // Chillwind Yeti: 4/5
        expect(cardC.child.health.state.current).toBe(5);
        expect(handA.child.cards.length).toBe(1); // Chillwind Yeti in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Chillwind Yeti
        let promise = cardC.play();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Chillwind Yeti should be on board
        expect(boardA.child.cards.length).toBe(1); // Chillwind Yeti on board
        expect(handA.child.cards.length).toBe(0); // Chillwind Yeti moved to board
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6
    });
});
