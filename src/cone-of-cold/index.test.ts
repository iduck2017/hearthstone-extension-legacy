/**
 * Test cases for Cone of Cold
 * 
 * 1. cone-of-cold-cast: Player A uses Cone of Cold on Player B's minions, Wisp dies and Footman takes damage
 * 2. turn-next: After turn passes, frozen Footman cannot attack
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil } from "hearthstone-core";
import { ConeOfColdModel } from "./index";
import { WispModel } from "../wisp";
import { GoldshireFootmanModel } from "../goldshire-footman";
import { boot } from "../boot";
import { ManaWyrmModel } from "../mana-wyrm";

describe('cone-of-cold', () => {
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
                        child: { minions: [
                            new WispModel(), 
                            new GoldshireFootmanModel(), 
                            new ManaWyrmModel()
                        ] }
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
    const cardF = boardB.child.minions.find(item => item instanceof ManaWyrmModel);
    const roleD = cardD?.child.role;
    const roleE = cardE?.child.role;
    const roleF = cardF?.child.role;
    const roleB = playerB.child.hero.child.role;
    if (!cardC || !roleD || !roleE || !roleF) throw new Error();

    test('cone-of-cold-cast', async () => {
        // Check initial stats
        expect(roleD.child.health.state.current).toBe(1); // Wisp: 1 health
        expect(roleE.child.health.state.current).toBe(2); // Goldshire Footman: 2 health
        expect(roleD.child.entries.child.frozen.state.isActive).toBe(false);
        expect(roleE.child.entries.child.frozen.state.isActive).toBe(false);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.spells.length).toBe(1);
        expect(boardB.child.minions.length).toBe(3);

        // Player A uses Cone of Cold on Player B's Wisp (leftmost minion)
        const promise = cardC.play();
        expect(SelectUtil.current?.options).toContain(roleD);
        expect(SelectUtil.current?.options).toContain(roleE);
        expect(SelectUtil.current?.options).not.toContain(roleB);
        // choose Wisp
        SelectUtil.set(roleD);
        await promise;

        // Wisp should die (1 - 1 = 0), Footman should take 1 damage (2 - 1 = 1)
        expect(roleD.child.health.state.current).toBe(0); // Wisp dies
        expect(cardD.child.dispose.status).toBe(true); // Wisp dies
        expect(roleD.child.entries.child.frozen.state.isActive).toBe(true);

        expect(roleE.child.health.state.current).toBe(1); // Footman: 2 - 1 = 1
        expect(roleE.child.entries.child.frozen.state.isActive).toBe(true);

        expect(roleF.child.health.state.current).toBe(3); // Mana Wyrm: 3
        expect(roleF.child.entries.child.frozen.state.isActive).toBe(false);
        
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 cost
        expect(handA.child.spells.length).toBe(0);

        // Dead Wisp should be removed from board, Footman remains
        expect(boardB.child.minions.length).toBe(2);
    })

    test('turn-next', async () => {
        const turn = game.child.turn;
        
        // Turn passes to Player B
        turn.next();
        expect(turn.refer.current).toBe(playerB);

        // Check that frozen Footman cannot attack
        expect(roleE.child.action.status).toBe(false); // Goldshire Footman cannot attack
        expect(roleE.child.entries.child.frozen.state.isActive).toBe(true);

        expect(roleF.child.action.status).toBe(true); // Mana Wyrm can attack
        expect(roleF.child.entries.child.frozen.state.isActive).toBe(false);
    })
})
