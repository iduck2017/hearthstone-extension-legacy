/**
 * Test cases for Water Elemental
 * 
 * 1. water-elemental-attack: Player A's Water Elemental attacks enemy minion, freezes it
 * 2. water-elemental-hero-attack: Player A's Water Elemental attacks enemy hero, freezes it
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, AnimeUtil } from "hearthstone-core";
import { WaterElementalModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";



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
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    const roleB = playerB.child.hero.child.role;
    if (!roleC || !roleD) throw new Error();

    test('water-elemental-attack', async () => {
        // Check initial stats
        expect(roleC.child.attack.state.current).toBe(3);
        expect(roleC.child.health.state.current).toBe(6);
        expect(roleD.child.feats.child.frozen.state.isActive).toBe(false);

        const promise = roleC.child.action.run();
        await AnimeUtil.sleep();
        expect(playerA.child.controller.current?.options).toContain(roleD);
        playerA.child.controller.set(roleD);
        await promise;

        // Wisp should be damaged and frozen
        expect(roleD.child.health.state.current).toBe(3);
        expect(roleD.child.health.state.damage).toBe(3);
        expect(roleD.child.feats.child.frozen.state.isActive).toBe(true);

        expect(roleC.child.health.state.current).toBe(3);
        expect(roleC.child.health.state.damage).toBe(3);
        expect(roleC.child.feats.child.frozen.state.isActive).toBe(true);
    })

    test('water-elemental-attack', async () => {
        const turn = game.child.turn;
        turn.next();

        expect(roleC.child.feats.child.frozen.state.isActive).toBe(true);
        expect(roleD.child.feats.child.frozen.state.isActive).toBe(true);
        expect(roleC.child.action.status).toBe(false);
        expect(roleD.child.action.status).toBe(false);

        turn.next();

        expect(roleC.child.feats.child.frozen.state.isActive).toBe(true);
        expect(roleD.child.feats.child.frozen.state.isActive).toBe(false);
    })
})
