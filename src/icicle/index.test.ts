/**
 * Test cases for Icicle
 * 
 * 1. ice-lance-cast: Player A uses Ice Lance on own Water Elemental to freeze it
 * 2. icicle-cast: Player A uses Icicle on frozen Water Elemental, deals damage and draws a card
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { IcicleModel } from "./index";
import { WaterElementalModel } from "../water-elemental";
import { IceLanceModel } from "../ice-lance";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('icicle', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [new WaterElementalModel()] }
                    }),
                    hand: new HandModel({
                        child: { spells: [new IceLanceModel(), new IcicleModel()] }
                    }),
                    deck: new DeckModel({
                        child: { 
                            minions: [new WispModel()] 
                        }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [] }
                    }),
                    hand: new HandModel({
                        child: { spells: [] }
                    })
                }
            })
        }
    });
    boot(game);
    
    const playerA = game.child.playerA;
    const handA = playerA.child.hand;
    const boardA = playerA.child.board;
    const deckA = playerA.child.deck;
    const cardC = handA.child.spells.find(item => item instanceof IceLanceModel);
    const cardD = handA.child.spells.find(item => item instanceof IcicleModel);
    const cardE = boardA.child.minions.find(item => item instanceof WaterElementalModel);
    const roleE = cardE?.child.role;
    if (!cardC || !cardD || !roleE) throw new Error();

    test('ice-lance-cast', async () => {
        // Check initial stats
        expect(roleE.child.health.state.current).toBe(6);
        expect(roleE.child.health.state.damage).toBe(0);
        expect(roleE.child.feats.child.frozen.state.isActive).toBe(false);
        expect(roleE.child.action.status).toBe(true); // Can attack initially
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.spells.length).toBe(2);
        expect(deckA.child.minions.length).toBe(1);

        // Step 1: Player A uses Ice Lance on own Water Elemental to freeze it
        let promise = cardC.play();
        expect(playerA.child.controller.current?.options).toContain(roleE);
        playerA.child.controller.set(roleE);
        await promise;

        // Water Elemental should be frozen and cannot attack
        expect(roleE.child.feats.child.frozen.state.isActive).toBe(true);
        expect(roleE.child.action.status).toBe(false); // Cannot attack when frozen
        expect(playerA.child.mana.state.current).toBe(9); // 10 - 1 cost
        expect(handA.child.spells.length).toBe(1); // Ice Lance consumed
    })

    test('icicle-cast', async () => {
        

        // Step 2: Player A uses Icicle on frozen Water Elemental
        const promise = cardD.play();
        expect(playerA.child.controller.current?.options).toContain(roleE);
        playerA.child.controller.set(roleE);
        await promise;

        // Water Elemental should take 2 damage and Player A should draw a card (because it was frozen)
        expect(roleE.child.health.state.current).toBe(4); // 6 - 2 = 4
        expect(roleE.child.health.state.damage).toBe(2);
        expect(playerA.child.mana.state.current).toBe(7); // 9 - 2 cost
        expect(handA.child.spells.length).toBe(0); // Icicle consumed
        expect(deckA.child.minions.length).toBe(0); // Card drawn
        expect(handA.child.minions.length).toBe(1); // Wisp drawn to hand
    })
})