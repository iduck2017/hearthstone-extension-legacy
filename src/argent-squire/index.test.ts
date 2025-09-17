/**
 * Test cases for Argent Squire
 * 
 * 1. argent-squire-attack: Player A's Argent Squire attacks Player B's Argent Squire, Both squires survive.
 * 2. argent-squire-die: Player B's Argent Squire attacks Player A's Argent Squire, both squires die.
 */

import { GameModel, PlayerModel, MageModel, BoardModel, SelectUtil, ManaModel } from "hearthstone-core";
import { ArgentSquireModel } from "./index";
import { boot } from "../boot";
import { DebugUtil, LogLevel } from "set-piece";

describe('argent-squire', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new ArgentSquireModel()] }
                    })),
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new ArgentSquireModel()] }
                    }))
                }
            }))
        }
    }));
    boot(game);
    
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const cardC = boardA.child.minions.find(item => item instanceof ArgentSquireModel);
    const cardD = boardB.child.minions.find(item => item instanceof ArgentSquireModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    if (!roleC || !roleD) throw new Error();
    const turn = game.child.turn;

    test('argent-squire-attack', async () => {
        // First attack: both squires attack each other
        // Divine Shield blocks the damage, so no health is lost
        expect(roleC.child.health.state.current).toBe(1);
        expect(roleD.child.health.state.current).toBe(1);
        expect(roleC.child.entries.child.divineShield.state.isActive).toBe(true);
        expect(roleD.child.entries.child.divineShield.state.isActive).toBe(true);
        const promise = roleC.child.action.run();
        expect(SelectUtil.current?.options).toContain(roleD);
        SelectUtil.set(roleD);
        await promise;
        expect(roleC.child.health.state.current).toBe(1);
        expect(roleD.child.health.state.current).toBe(1);
        expect(roleC.child.entries.child.divineShield.state.isActive).toBe(false);
        expect(roleD.child.entries.child.divineShield.state.isActive).toBe(false);
        expect(cardC.child.dispose.status).toBe(false);
        expect(cardD.child.dispose.status).toBe(false);
    })

    test('argent-squire-die', async () => {
        turn.next();
        
        const promise = roleD.child.action.run();
        expect(SelectUtil.current?.options).toContain(roleC);
        SelectUtil.set(roleC);
        await promise;

        expect(roleC.child.health.state.current).toBe(0);
        expect(roleD.child.health.state.current).toBe(0);
        expect(cardC.child.dispose.status).toBe(true);
        expect(cardD.child.dispose.status).toBe(true);

        expect(boardA.child.minions.length).toBe(0);
        expect(boardB.child.minions.length).toBe(0);
    })
})