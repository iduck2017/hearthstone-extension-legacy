/**
 * Test cases for Jaina's Gift
 * 
 * 1. jainas-gift-cast: Player A plays Jaina's Gift, discovers a Temporary spell
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { JainasGiftModel } from "./index";
import { boot } from "../../../src/boot";
import { FireballModel } from "../fireball";
import { FrostboltModel } from "../frostbolt";
import { ArcaneIntellectModel } from "../arcane-intellect";

describe('jainas-gift', () => {
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
                        child: { cards: [new JainasGiftModel()] }
                    }),
                    deck: new DeckModel({
                        child: { 
                            cards: [] 
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
                        child: { cards: [] }
                    })
                }
            })
        }
    });
    boot(game);
    
    const playerA = game.child.playerA;
    const handA = playerA.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof JainasGiftModel);
    if (!cardC) throw new Error();

    test('jainas-gift-cast', async () => {
        // Check initial stats
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(1);

        // Play Jaina's Gift
        // TODO: When discover mechanics are implemented, test the discover logic
        const promise = cardC.play();
        await promise;

        const selector = playerA.controller.current;
        expect(selector).toBeDefined();
        expect(selector?.options.length).toBe(3);

        const cardD = selector?.options.find(item => item instanceof FireballModel);
        const cardE = selector?.options.find(item => item instanceof ArcaneIntellectModel);
        const cardF = selector?.options.find(item => item instanceof FrostboltModel);   
        expect(cardD).toBeDefined();   
        expect(cardE).toBeDefined();
        expect(cardF).toBeDefined();

        playerA.controller.set(cardD);
        expect(handA.child.cards.length).toBe(1);
        expect(handA.child.cards).toContain(cardD);

        // Check that Jaina's Gift was consumed
        expect(playerA.child.mana.state.current).toBe(9); // 10 - 1 cost
        // TODO: Verify that a discovered card was added to hand when discover is implemented
    })
})

