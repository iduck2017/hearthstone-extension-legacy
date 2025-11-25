/**
 * Test cases for Holy Wrath
 *
 * 1. initial-state:
 *    - Player A has Holy Wrath in hand
 *    - Player A has Wisp (0 cost) in deck
 *    - Player B has Holy Wrath in hand
 *    - Player B has Core Hound (7 cost) in deck
 * 2. holy-wrath-cast-wisp:
 *    - Player A uses Holy Wrath on Player B's hero
 *    - Assert: Player A draws Wisp (0 cost)
 *    - Assert: Player B's hero takes 0 damage
 * 3. holy-wrath-cast-hound:
 *    - Turn switches to Player B
 *    - Player B uses Holy Wrath on Player A's hero
 *    - Assert: Player B draws Core Hound (7 cost)
 *    - Assert: Player A's hero takes 7 damage
 */

import { GameModel, PlayerModel, MageModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { HolyWrathModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { CoreHoundModel } from "../../neutral/core-hound";
import { boot } from "../../boot";

describe('holy-wrath', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    hand: new HandModel({
                        child: {
                            cards: [new HolyWrathModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: {
                            cards: [new WispModel()]
                        }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    hand: new HandModel({
                        child: {
                            cards: [new HolyWrathModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: {
                            cards: [new CoreHoundModel()]
                        }
                    })
                }
            })
        }
    });

    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;
    const handA = playerA.child.hand;
    const deckA = playerA.child.deck;
    const handB = playerB.child.hand;
    const deckB = playerB.child.deck;

    const cardC = handA.child.cards.find(item => item instanceof HolyWrathModel);
    if (!cardC) throw new Error();

    const cardD = handB.child.cards.find(item => item instanceof HolyWrathModel);
    if (!cardD) throw new Error();

    test('holy-wrath-cast', async () => {
        expect(handA.child.cards.length).toBe(1);
        expect(deckA.child.cards.length).toBe(1);
        expect(heroB.child.health.state.current).toBe(30);

        // Player A uses Holy Wrath on Player B's hero
        let promise = cardC.play();
        await CommonUtil.sleep();
        playerA.controller.set(heroB);
        await promise;

        // Assert: Player A drew Wisp (0 cost)
        expect(handA.child.cards.length).toBe(1); // Holy Wrath consumed, Wisp drawn
        expect(deckA.child.cards.length).toBe(0); // Deck is empty
        const cardE = handA.child.cards.find(item => item instanceof WispModel);
        expect(cardE).toBeDefined();
        
        // Assert: Player B's hero takes 0 damage (Wisp costs 0)
        expect(heroB.child.health.state.current).toBe(30);
    });

    test('holy-wrath-cast', async () => {
        // Turn switches to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        expect(handB.child.cards.length).toBe(1);
        expect(deckB.child.cards.length).toBe(1);
        expect(heroA.child.health.state.current).toBe(30);

        // Player B uses Holy Wrath on Player A's hero
        let promise = cardD.play();
        await CommonUtil.sleep();
        playerB.controller.set(heroA);
        await promise;

        // Assert: Player B drew Core Hound (7 cost)
        expect(handB.child.cards.length).toBe(1); // Holy Wrath consumed, Core Hound drawn
        expect(deckB.child.cards.length).toBe(0); // Deck is empty
        const cardF = handB.child.cards.find(item => item instanceof CoreHoundModel);
        expect(cardF).toBeDefined();
        
        // Assert: Player A's hero takes 7 damage (Core Hound costs 7)
        expect(heroA.child.health.state.current).toBe(23);
    });
});

