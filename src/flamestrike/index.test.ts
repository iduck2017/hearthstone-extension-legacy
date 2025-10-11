/**
 * Test cases for Flamestrike
 * 
 * Initial state: Player A has Flamestrike in hand. Player B has Wisp and Water Elemental on board.
 * 
 * flamestrike-cast: Player A plays Flamestrike, deals 5 damage to all enemy minions.
 * Wisp (1/1) dies, Water Elemental (3/6) survives with 1 health.
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel } from "hearthstone-core";
import { FlamestrikeModel } from "./index";
import { WispModel } from "../wisp";
import { WaterElementalModel } from "../water-elemental";
import { boot } from "../boot";

describe('flamestrike', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [] }
                    }),
                    hand: new HandModel({
                        child: { spells: [new FlamestrikeModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            minions: [new WispModel(), new WaterElementalModel()]
                        }
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
    const playerB = game.child.playerB;
    const handA = playerA.child.hand;
    const boardB = playerB.child.board;
    const cardC = handA.child.spells.find(item => item instanceof FlamestrikeModel);
    const cardD = boardB.child.minions.find(item => item instanceof WispModel);
    const cardE = boardB.child.minions.find(item => item instanceof WaterElementalModel);
    const roleD = cardD?.child.role;
    const roleE = cardE?.child.role;
    const roleB = playerB.child.hero.child.role;
    if (!cardC || !roleD || !roleE) throw new Error();

    test('flamestrike-cast', async () => {
        // Check initial stats
        expect(roleD.child.health.state.current).toBe(1); // Wisp: 1/1
        expect(roleE.child.health.state.current).toBe(6); // Water Elemental: 3/6
        expect(roleB.child.health.state.current).toBe(30); // Player B hero: 30 health
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.spells.length).toBe(1);
        expect(boardB.child.minions.length).toBe(2);

        // Player A plays Flamestrike - no target selection needed
        await cardC.play();

        // Check damage results
        expect(roleD.child.health.state.current).toBe(-4); // Wisp: 1 - 5 = -4 (dies)
        expect(cardD.child.dispose.status).toBe(true); // Wisp dies

        expect(roleE.child.health.state.current).toBe(1); // Water Elemental: 6 - 5 = 1 (survives)
        expect(roleE.child.health.state.damage).toBe(5);
        expect(cardE.child.dispose.status).toBe(false); // Water Elemental survives

        expect(roleB.child.health.state.current).toBe(30); // Hero should not be affected

        expect(playerA.child.mana.state.current).toBe(3); // 10 - 7 cost
        expect(handA.child.spells.length).toBe(0); // Flamestrike consumed

        // Only dead minion (Wisp) should be removed from board
        expect(boardB.child.minions.length).toBe(1);
    });
});
