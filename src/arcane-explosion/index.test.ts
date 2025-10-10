/**
 * Test cases for Arcane Explosion
 * 
 * 1. arcane-explosion-cast: Player A plays Arcane Explosion and deals 1 damage to all enemy minions
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel } from "hearthstone-core";
import { ArcaneExplosionModel } from "./index";
import { WispModel } from "../wisp";
import { GoldshireFootmanModel } from "../goldshire-footman";
import { boot } from "../boot";

describe('arcane-explosion', () => {
    const game = new GameModel(() => ({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [] }
                    })),
                    hand: new HandModel(() => ({
                        child: { spells: [new ArcaneExplosionModel()] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new WispModel(), new GoldshireFootmanModel()] }
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
    const cardD = handA.child.spells.find(item => item instanceof ArcaneExplosionModel);
    const cardE = boardB.child.minions.find(item => item instanceof WispModel);
    const cardF = boardB.child.minions.find(item => item instanceof GoldshireFootmanModel);
    const roleE = cardE?.child.role;
    const roleF = cardF?.child.role;
    if (!cardD || !roleE || !roleF) throw new Error();

    test('arcane-explosion-cast', async () => {
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.spells.length).toBe(1);
        expect(roleE.child.health.state.current).toBe(1); // Wisp: 1 health
        expect(roleF.child.health.state.current).toBe(2); // Goldshire Footman: 2 health
        expect(boardB.child.minions.length).toBe(2);

        // Play Arcane Explosion - no target selection needed
        await cardD.play();

        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 cost
        expect(handA.child.spells.length).toBe(0);
        
        // All enemy minions should take 1 damage
        expect(roleE.child.health.state.current).toBe(0); // Wisp: 1 -> 0 (dies)
        expect(roleF.child.health.state.current).toBe(1); // Goldshire Footman: 2 -> 1

        // Dead minion should be removed from board
        expect(boardB.child.minions.length).toBe(1);
        expect(boardB.child.minions[0]).toBe(cardF);
    })

})
