/**
 * Test cases for Water Elemental
 * 
 * 1. water-elemental-attack: Player A's Water Elemental attacks enemy minion, freezes it
 * 2. water-elemental-hero-attack: Player A's Water Elemental attacks enemy hero, freezes it
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, AnimeUtil } from "hearthstone-core";
import { WaterElementalModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";



describe('water-elemental', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new WaterElementalModel()] }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new WaterElementalModel()] }
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
    const boardB = playerB.child.board;
    const cardC = boardA.child.cards.find(item => item instanceof WaterElementalModel);
    const cardD = boardB.child.cards.find(item => item instanceof WaterElementalModel);
    if (!cardC || !cardD) throw new Error();

    test('water-elemental-attack', async () => {
        // Check initial stats
        expect(cardC.child.attack.state.current).toBe(3);
        expect(cardC.child.health.state.current).toBe(6);
        expect(cardD.child.feats.child.frozen.state.isActive).toBe(false);

        const promise = cardC.child.action.run();
        await AnimeUtil.sleep();
        expect(playerA.child.controller.current?.options).toContain(cardD);
        playerA.child.controller.set(cardD);
        await promise;

        // Wisp should be damaged and frozen
        expect(cardD.child.health.state.current).toBe(3);
        expect(cardD.child.health.state.damage).toBe(3);
        expect(cardD.child.feats.child.frozen.state.isActive).toBe(true);

        expect(cardC.child.health.state.current).toBe(3);
        expect(cardC.child.health.state.damage).toBe(3);
        expect(cardC.child.feats.child.frozen.state.isActive).toBe(true);
    })

    test('water-elemental-attack', async () => {
        const turn = game.child.turn;
        turn.next();

        expect(cardC.child.feats.child.frozen.state.isActive).toBe(true);
        expect(cardD.child.feats.child.frozen.state.isActive).toBe(true);
        expect(cardC.child.action.status).toBe(false);
        expect(cardD.child.action.status).toBe(false);

        turn.next();

        expect(cardC.child.feats.child.frozen.state.isActive).toBe(true);
        expect(cardD.child.feats.child.frozen.state.isActive).toBe(false);
    })
})
