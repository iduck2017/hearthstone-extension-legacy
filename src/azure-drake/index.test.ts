/**
 * Test cases for Azure Drake
 * 
 * Initial state: Player A has Azure Drake in hand and Fireball in deck.
 * 
 * 1. azure-drake-play: Player A plays Azure Drake, drawing Fireball.
 * 2. fireball-cast: Player A uses Fireball with Spell Damage +1.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { AzureDrakeModel } from "./index";
import { FireballModel } from "../fireball";
import { boot } from "../boot";

describe('azure-drake', () => {
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
                            cards: [new AzureDrakeModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { 
                            cards: [new FireballModel()]
                        }
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
    const deckA = playerA.child.deck;
    const cardC = handA.child.cards.find(item => item instanceof AzureDrakeModel);
    const cardD = deckA.child.cards.find(item => item instanceof FireballModel);
    if (!cardC || !cardD) throw new Error();
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;

    test('azure-drake-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(4); // Azure Drake: 4/4
        expect(cardC.child.health.state.current).toBe(4);
        expect(handA.child.cards.length).toBe(1); // Azure Drake in hand
        expect(deckA.child.cards.length).toBe(1); // Fireball in deck
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Azure Drake
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Azure Drake should be on board and Fireball should be drawn
        expect(boardA.child.cards.length).toBe(1); // Azure Drake on board
        expect(handA.child.cards.length).toBe(1); // Fireball drawn to hand
        expect(deckA.child.cards.length).toBe(0); // Fireball moved from deck
        expect(playerA.child.mana.state.current).toBe(5); // 10 - 5 = 5
    });

    test('fireball-cast', async () => {
        // Cast Fireball targeting Player B's hero
        const promise = cardD.play();
        expect(playerA.child.controller.current?.options).toContain(heroA); // Can target friendly hero
        expect(playerA.child.controller.current?.options).toContain(heroB); // Can target enemy hero
        playerA.child.controller.set(heroB); // Target Player B's hero
        await promise;

        // Fireball should deal 7 damage (6 + 1 from Spell Damage +1)
        expect(heroB.child.health.state.current).toBe(23); // 30 - 7 = 23

        // Fireball should be consumed
        expect(handA.child.cards.filter(item => item instanceof FireballModel).length).toBe(0); // Fireball consumed
        expect(playerA.child.mana.state.current).toBe(1); // 5 - 4 = 1
    });
});
