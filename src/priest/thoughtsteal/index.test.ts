/**
 * Test cases for Thoughtsteal
 * 
 * Initial state: Player A has Thoughtsteal in hand.
 * Player B has 1 Wisp and 1 Stonetusk Boar in deck.
 * 
 * 1. thoughtsteal-cast: Player A uses Thoughtsteal, copies 2 random cards from Player B's deck.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { ThoughtstealModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { StonetuskBoarModel } from "../../neutral/stonetusk-boar";
import { boot } from "../../boot";

describe('thoughtsteal', () => {
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
                            cards: [new ThoughtstealModel()]
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
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
                    }),
                    deck: new DeckModel({
                        child: { 
                            cards: [new WispModel(), new StonetuskBoarModel()]
                        }
                    })
                }
            })
        }
    });
    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const handA = playerA.child.hand;
    const deckB = playerB.child.deck;
    const cardC = handA.child.cards.find(item => item instanceof ThoughtstealModel);
    const cardD = deckB.child.cards.find(item => item instanceof WispModel);
    const cardE = deckB.child.cards.find(item => item instanceof StonetuskBoarModel);
    if (!cardC) throw new Error();

    test('thoughtsteal-cast', async () => {
        // Check initial state
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(1);
        expect(deckB.child.cards.length).toBe(2);

        // Player A uses Thoughtsteal
        const promise = cardC.play();
        await promise;

        // Player A should have copied 2 cards from Player B's deck
        expect(handA.child.cards.length).toBe(2); // Thoughtsteal consumed, 2 cards copied

        const cardF = handA.child.cards.find(item => item instanceof WispModel);
        const cardG = handA.child.cards.find(item => item instanceof StonetuskBoarModel);
        if (!cardF || !cardG) throw new Error();
        expect(cardF.refer.creator).toBe(cardD);
        expect(cardG.refer.creator).toBe(cardE);

        // Player B's deck should be unchanged
        expect(deckB.child.cards.length).toBe(2); // Original deck unchanged
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 cost
    });
});
