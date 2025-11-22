/**
 * Test cases for Twilight Drake
 * 
 * Initial state: Player A has Twilight Drake and 2 other cards in hand.
 * Player B has empty board.
 * 
 * 1. twilight-drake-play: Player A plays Twilight Drake, gaining +3 Health (1 base + 2 from hand size).
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { TwilightDrakeModel } from "./index";
import { WispModel } from '../../neutral/wisp';
import { boot } from '../../boot';

describe('twilight-drake', () => {
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
                            cards: [
                                new TwilightDrakeModel(), 
                                new WispModel(), 
                                new WispModel(),
                            ]
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
    const cardC = handA.child.cards.find(item => item instanceof TwilightDrakeModel);
    if (!cardC) throw new Error();

    test('twilight-drake-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(4); // Twilight Drake: 4/1
        expect(cardC.child.health.state.current).toBe(1);
        expect(handA.child.cards.length).toBe(3); // Twilight Drake + 2 Wisp in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Twilight Drake
        let promise = cardC.play();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Twilight Drake should be on board
        expect(boardA.child.cards.length).toBe(1); // Twilight Drake on board
        expect(handA.child.cards.length).toBe(2); // 2 Wisp remaining in hand
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6

        // Twilight Drake should gain +2 Health (2 cards in hand when played)
        expect(cardC.child.health.state.current).toBe(3); // 1 base + 2 from hand size = 3
        expect(cardC.child.health.state.origin).toBe(1);
        expect(cardC.child.attack.state.current).toBe(4); // Attack remains 4
    });
});
