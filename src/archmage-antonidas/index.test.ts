/**
 * Test cases for Archmage Antonidas
 * 
 * Initial state: Player A has Antonidas on board, hand with Frostbolt and Arcane Intellect. Player B has Wisp on board.
 * 
 * 1. antonidas-play: Player A plays Antonidas (7/5/7)
 * 2. frostbolt-cast: Player A uses Frostbolt on Wisp, Antonidas adds Fireball to hand
 * 3. arcane-intellect-cast: Player A uses Arcane Intellect, Antonidas adds another Fireball
 * 4. fireball-cast: Player A uses the generated Fireball on Wisp
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { ArchmageAntonidasModel } from "./index";
import { FrostboltModel } from "../frostbolt";
import { ArcaneIntellectModel } from "../arcane-intellect";
import { FireballModel } from "../fireball";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('archmage-antonidas', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new ArchmageAntonidasModel()] }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new FrostboltModel()]
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
                    board: new BoardModel({
                        child: { cards: [new WispModel()] }
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
    const handA = playerA.child.hand;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const cardC = boardA.child.cards.find(item => item instanceof ArchmageAntonidasModel);
    const cardD = handA.child.cards.find(item => item instanceof FrostboltModel);
    const cardF = boardB.child.cards.find(item => item instanceof WispModel);
    const heroB = playerB.child.hero;
    if (!cardC || !cardD || !cardF) throw new Error();

    test('frostbolt-cast', async () => {
        // Check initial stats
        expect(handA.child.cards.length).toBe(1); // Frostbolt
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.some(card => card instanceof FireballModel)).toBe(false);

        // Player A uses Frostbolt on Wisp
        const promise = cardD.play();
        expect(playerA.child.controller.current?.options).toContain(cardF);
        playerA.child.controller.set(cardF);
        await promise;

        // Antonidas should add a Fireball to hand
        expect(handA.child.cards.length).toBe(1); // generated Fireball
        expect(handA.child.cards.some(card => card instanceof FireballModel)).toBe(true);
        expect(boardB.child.cards.length).toBe(0);
        expect(cardF.child.health.state.current).toBe(-2); // Wisp: 1 - 3 = -2 (dies)
        expect(playerA.child.mana.state.current).toBe(8); // 3 - 2 cost
    });

    test('fireball-cast', async () => {
        // Get the generated Fireball
        const cardG = handA.child.cards.find(card => card instanceof FireballModel);
        if (!cardG) throw new Error();

        // Check initial stats
        expect(playerA.child.mana.state.current).toBe(8);
        expect(handA.child.cards.length).toBe(1);

        // Player A uses the generated Fireball on Wisp (which should be dead, so target hero)
        const promise = cardG.play();
        expect(playerA.child.controller.current?.options).toContain(heroB);
        playerA.child.controller.set(heroB);
        await promise;

        // Check Fireball was used
        expect(playerA.child.mana.state.current).toBe(4);
        expect(handA.child.cards.length).toBe(1); // Fireball consumed, but may have other cards
        expect(heroB.child.health.state.current).toBe(24); // 30 - 6 = 24
    });
});
