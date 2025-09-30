/**
 * Test cases for Cone of Cold
 * 
 * 1. cone-of-cold-cast: Player A uses Cone of Cold on Player B's minions, Wisp dies and Footman takes damage
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil } from "hearthstone-core";
import { ConeOfColdModel } from "./index";
import { WispModel } from "../wisp";
import { GoldshireFootmanModel } from "../goldshire-footman";
import { boot } from "../boot";

describe('cone-of-cold', () => {
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
                        child: { spells: [new ConeOfColdModel()] }
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
    const cardC = handA.child.spells.find(item => item instanceof ConeOfColdModel);
    const cardD = boardB.child.minions.find(item => item instanceof WispModel);
    const cardE = boardB.child.minions.find(item => item instanceof GoldshireFootmanModel);
    const roleD = cardD?.child.role;
    const roleE = cardE?.child.role;
    const roleB = playerB.child.hero.child.role;
    if (!cardC || !roleD || !roleE) throw new Error();

    test('cone-of-cold-cast', async () => {
        // Check initial stats
        expect(roleD.child.health.state.current).toBe(1); // Wisp: 1 health
        expect(roleE.child.health.state.current).toBe(2); // Goldshire Footman: 2 health
        expect(roleD.child.entries.child.frozen.state.isActive).toBe(false);
        expect(roleE.child.entries.child.frozen.state.isActive).toBe(false);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.spells.length).toBe(1);
        expect(boardB.child.minions.length).toBe(2);

        // Player A uses Cone of Cold on Player B's Wisp (leftmost minion)
        const promise = cardC.play();
        expect(SelectUtil.current?.options).toContain(roleD);
        expect(SelectUtil.current?.options).toContain(roleE);
        expect(SelectUtil.current?.options).not.toContain(roleB);
        SelectUtil.set(roleD);
        await promise;

        // Wisp should die (1 - 1 = 0), Footman should take 1 damage (2 - 1 = 1)
        expect(roleD.child.health.state.current).toBe(0); // Wisp dies
        expect(cardD.child.dispose.status).toBe(true); // Wisp dies
        expect(roleD.child.entries.child.frozen.state.isActive).toBe(true);

        expect(roleE.child.health.state.current).toBe(1); // Footman: 2 - 1 = 1
        expect(roleE.child.entries.child.frozen.state.isActive).toBe(true);
        
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 cost
        expect(handA.child.spells.length).toBe(0);

        // Dead Wisp should be removed from board, Footman remains
        expect(boardB.child.minions.length).toBe(1);
        expect(boardB.child.minions[0]).toBe(cardE); // Only Footman remains
    })
})
