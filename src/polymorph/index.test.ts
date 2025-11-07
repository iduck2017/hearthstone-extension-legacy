/**
 * Test cases for Polymorph
 * 
 * Initial state: Player B has Water Elemental and Wisp (in that order)
 * polymorph-cast: Player A uses Polymorph on Water Elemental, transforms it into Sheep, positioned to the left of Wisp
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel } from "hearthstone-core";
import { PolymorphModel } from "./index";
import { WaterElementalModel } from "../water-elemental";
import { WispModel } from "../wisp";
import { SheepModel } from "./minion";
import { boot } from "../boot";

describe('polymorph', () => {
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
                        child: { cards: [new PolymorphModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [
                                new WaterElementalModel(), // Position 0 (left)
                                new WispModel()            // Position 1 (right)
                            ]
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
    const cardC = handA.child.cards.find(item => item instanceof PolymorphModel);
    const cardD = boardB.child.cards.find(item => item instanceof WaterElementalModel);
    const cardE = boardB.child.cards.find(item => item instanceof WispModel);
    const roleD = cardD?.child.role;
    const roleE = cardE?.child.role;
    const roleB = playerB.child.hero.child.role;
    if (!cardC || !roleD || !roleE) throw new Error();

    test('polymorph-cast', async () => {
        // Check initial stats
        expect(boardB.child.cards.length).toBe(2);
        expect(boardB.child.cards[0]).toBe(cardD); // Water Elemental at position 0
        expect(boardB.child.cards[1]).toBe(cardE); // Wisp at position 1
        expect(roleD.child.attack.state.current).toBe(3); // Water Elemental: 3/6
        expect(roleD.child.health.state.current).toBe(6);
        expect(roleE.child.attack.state.current).toBe(1); // Wisp: 1/1
        expect(roleE.child.health.state.current).toBe(1);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(1);

        // Player A uses Polymorph on Water Elemental
        const promise = cardC.play();
        expect(playerA.child.controller.current?.options).toContain(roleD); // Water Elemental can be targeted
        expect(playerA.child.controller.current?.options).toContain(roleE); // Wisp can be targeted
        expect(playerA.child.controller.current?.options).not.toContain(roleB); // Hero cannot be targeted
        playerA.child.controller.set(roleD); // Target Water Elemental
        await promise;

        // Check transformation results
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 cost
        expect(handA.child.cards.length).toBe(0); // Polymorph consumed
        expect(boardB.child.cards.length).toBe(2); // Still 2 minions

        // Check that Water Elemental was transformed into Sheep
        const cardF = boardB.child.cards.find(item => item instanceof SheepModel);
        expect(cardF).toBeDefined();
        if (!cardF) throw new Error();
        const roleF = cardF.child.role;
        expect(roleF.child.attack.state.current).toBe(1); // Sheep: 1/1
        expect(roleF.child.health.state.current).toBe(1);

        // Check that Wisp is still at position 1
        expect(boardB.child.cards[0]).toBe(cardF); // Sheep at position 0
        expect(boardB.child.cards[1]).toBe(cardE); // Wisp still at position 1

        expect(roleD.route.board).toBeUndefined();
    });
});