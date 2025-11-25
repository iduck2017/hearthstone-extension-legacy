/**
 * Test cases for Divine Favor
 * 
 * 1. initial-state:
 *    - Player A has Divine Favor in hand
 *    - Player A has 1 card in hand (Divine Favor)
 *    - Player A has 5 cards in deck
 *    - Player B has 3 cards in hand
 * 2. divine-favor-cast:
 *    - Player A uses Divine Favor
 *    - Assert: Player A's hand size is 3 (matches Player B's hand size)
 *    - Assert: Player A's deck size is 2 (5 - 3 = 2, drew 3 cards)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { DivineFavorModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";

describe('divine-favor', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new DivineFavorModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { 
                            cards: [
                                new WispModel(),
                                new WispModel(),
                                new WispModel(),
                                new WispModel(),
                                new WispModel()
                            ]
                        }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [
                                new WispModel(),
                                new WispModel(),
                                new WispModel()
                            ]
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
    const handA = playerA.child.hand;
    const deckA = playerA.child.deck;
    const handB = playerB.child.hand;
    
    const cardC = handA.child.cards.find(item => item instanceof DivineFavorModel);
    if (!cardC) throw new Error();

    test('divine-favor-cast', async () => {
        // Check initial state
        expect(handA.child.cards.length).toBe(1); // Player A has 1 card (Divine Favor)
        expect(handB.child.cards.length).toBe(3); // Player B has 3 cards
        expect(deckA.child.cards.length).toBe(5); // Player A has 5 cards in deck

        // Player A uses Divine Favor
        await cardC.play();

        // Assert: Player A's hand size is 3 (matches Player B's hand size)
        // Note: Divine Favor is removed from hand, so we need to draw 3 cards to match opponent's 3
        expect(handA.child.cards.length).toBe(3);
        // Assert: Player A's deck size is 2 (5 - 3 = 2, drew 3 cards)
        expect(deckA.child.cards.length).toBe(2);
    });
});

