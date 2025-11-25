/**
 * Test cases for Lay on Hands
 *
 * 1. initial-state:
 *    - Player A has Fireball in hand
 *    - Player A has Lay on Hands in hand
 *    - Player A has 5 cards in deck
 *    - Player A hero health 30
 * 2. fireball-cast:
 *    - Player A uses Fireball on Player A's hero
 *    - Assert: Player A hero health is 24 (30 - 6)
 * 3. lay-on-hands-cast:
 *    - Player A uses Lay on Hands
 *    - Assert: Player A's hero health is 30 (24 + 8, capped at maximum)
 *    - Assert: Player A's hand size is 3 (Lay on Hands consumed, drew 3 cards)
 *    - Assert: Player A's deck size is 2 (5 - 3)
 */

import { GameModel, PlayerModel, MageModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { LayOnHandsModel } from "./index";
import { FireballModel } from "../../mage/fireball";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";

describe('lay-on-hands', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    hand: new HandModel({
                        child: {
                            cards: [new FireballModel(), new LayOnHandsModel()]
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
                    hand: new HandModel({
                        child: { cards: [] }
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
    const heroA = playerA.child.hero;
    const handA = playerA.child.hand;
    const deckA = playerA.child.deck;

    const cardC = handA.child.cards.find(item => item instanceof FireballModel);
    const cardD = handA.child.cards.find(item => item instanceof LayOnHandsModel);
    if (!cardC || !cardD) throw new Error();

    test('fireball-cast', async () => {
        expect(heroA.child.health.state.current).toBe(30);

        // Player A uses Fireball on Player A's hero
        let promise = cardC.play();
        await CommonUtil.sleep();
        playerA.controller.set(heroA);
        await promise;

        // Assert: Player A hero health is 24 (30 - 6)
        expect(heroA.child.health.state.current).toBe(24);
    });

    test('lay-on-hands-cast', async () => {
        expect(handA.child.cards.length).toBe(1);
        expect(deckA.child.cards.length).toBe(5);
        expect(heroA.child.health.state.current).toBe(24);

        // Player A uses Lay on Hands
        await cardD.play();

        // Assert: Player A's hero health is 30 (24 + 8, capped at maximum)
        expect(heroA.child.health.state.current).toBe(30);
        
        // Assert: Player A's hand size is 3 (Lay on Hands consumed, drew 3 cards)
        expect(handA.child.cards.length).toBe(3);
        
        // Assert: Player A's deck size is 2 (5 - 3)
        expect(deckA.child.cards.length).toBe(2);
    });
});

