/**
 * Test cases for Blizzard
 * 
 * 1. blizzard-cast: Player A uses Blizzard on enemy minions, deals 2 damage and freezes them
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { BlizzardModel } from "./index";
import { WispModel } from "../wisp";
import { WaterElementalModel } from "../water-elemental";
import { boot } from "../boot";

describe('blizzard', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [] }
                    })),
                    hand: new HandModel(() => ({
                        child: { spells: [new BlizzardModel()] }
                    })),
                    deck: new DeckModel(() => ({
                        child: { 
                            minions: [] 
                        }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new WispModel(), new WaterElementalModel()] }
                    })),
                    hand: new HandModel(() => ({
                        child: { spells: [] }
                    }))
                }
            }))
        }
    }));
    boot(game);
    
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const handA = playerA.child.hand;
    const boardB = playerB.child.board;
    const cardC = handA.child.spells.find(item => item instanceof BlizzardModel);
    const cardD = boardB.child.minions.find(item => item instanceof WispModel);
    const cardE = boardB.child.minions.find(item => item instanceof WaterElementalModel);
    const roleD = cardD?.child.role;
    const roleE = cardE?.child.role;
    const roleB = playerB.child.hero.child.role;
    if (!cardC || !roleD || !roleE) throw new Error();

    test('blizzard-cast', async () => {
        // Check initial stats
        expect(roleD.child.health.state.current).toBe(1); // Wisp: 1 health
        expect(roleE.child.health.state.current).toBe(6); // Water Elemental: 6 health
        expect(roleD.child.entries.child.frozen.state.isActive).toBe(false);
        expect(roleE.child.entries.child.frozen.state.isActive).toBe(false);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.spells.length).toBe(1);
        expect(boardB.child.minions.length).toBe(2);

        // Play Blizzard - no target selection needed
        await cardC.play();

        // All enemy minions should take 2 damage and be frozen
        expect(roleD.child.health.state.current).toBe(-1); // Wisp: 1 - 2 = -1 (dies)
        expect(roleD.child.entries.child.frozen.state.isActive).toBe(true);
        expect(cardD.child.dispose.status).toBe(true);

        expect(roleE.child.health.state.current).toBe(4); // Water Elemental: 6 - 2 = 4 (survives)
        expect(roleE.child.entries.child.frozen.state.isActive).toBe(true);
        
        expect(roleB.child.health.state.current).toBe(30);

        expect(playerA.child.mana.state.current).toBe(4); // 10 - 6 cost
        expect(handA.child.spells.length).toBe(0);

        // Only dead minion (Wisp) should be removed from board
        expect(boardB.child.minions.length).toBe(1);
    })
})
