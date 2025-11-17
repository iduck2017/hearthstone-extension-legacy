/**
 * Test cases for Pyroblast
 * 
 * Initial state: Player A has Pyroblast in hand. Player B has Water Elemental on board.
 * 
 * pyroblast-cast: Player A uses Pyroblast on Water Elemental, deals 10 damage.
 * Water Elemental (3/6) dies from 10 damage.
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel } from "hearthstone-core";
import { PyroblastModel } from "./index";
import { WaterElementalModel } from "../../mage/water-elemental";
import { boot } from "../../boot";

describe('pyroblast', () => {
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
                        child: { cards: [new PyroblastModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new WaterElementalModel()]
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
    const handA = playerA.child.hand;
    const boardB = playerB.child.board;
    const cardC = handA.child.cards.find(item => item instanceof PyroblastModel);
    const cardD = boardB.child.cards.find(item => item instanceof WaterElementalModel);
    if (!cardC || !cardD) throw new Error();
    const heroB = playerB.child.hero;

    test('pyroblast-cast', async () => {
        // Check initial stats
        expect(cardD.child.health.state.current).toBe(6); // Water Elemental: 3/6
        expect(heroB.child.health.state.current).toBe(30); // Player B hero: 30 health
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(1);
        expect(boardB.child.cards.length).toBe(1);

        // Player A uses Pyroblast on Water Elemental
        const promise = cardC.play();
        const options = playerA.child.controller.current?.options;
        expect(options).toContain(cardD); // Water Elemental can be targeted
        expect(options).toContain(heroB); // Hero can also be targeted
        playerA.child.controller.set(cardD); // Target Water Elemental
        await promise;

        // Water Elemental should die from 10 damage (6 - 10 = -4)
        expect(cardD.child.health.state.current).toBe(-4);
        expect(cardD.child.dispose.status).toBe(true); // Water Elemental dies

        expect(playerA.child.mana.state.current).toBe(0); // 10 - 10 cost
        expect(handA.child.cards.length).toBe(0); // Pyroblast consumed

        // Dead Water Elemental should be removed from board
        expect(boardB.child.cards.length).toBe(0);
    });
});
