/**
 * Test cases for Mana Wyrm
 * 
 * 1. mana-wyrm-trigger: Player A's Mana Wyrm gains +1 Attack when Player A casts a spell
 * 2. arcane-explosion-cast: Player B's spell does not trigger Player A's Mana Wyrm
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel } from "hearthstone-core";
import { ManaWyrmModel } from "./index";
import { ArcaneExplosionModel } from "../arcane-explosion";
import { boot } from "../boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('mana-wyrm', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new ManaWyrmModel()] }
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
                        child: { minions: [] }
                    })),
                    hand: new HandModel(() => ({
                        child: { spells: [new ArcaneExplosionModel()] }
                    }))
                }
            }))
        }
    }));
    boot(game);
    
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const handA = playerA.child.hand;
    const handB = playerB.child.hand;
    const boardA = playerA.child.board;
    const cardC = handA.child.spells.find(item => item instanceof ArcaneExplosionModel);
    const cardD = handB.child.spells.find(item => item instanceof ArcaneExplosionModel);
    const cardE = boardA.child.minions.find(item => item instanceof ManaWyrmModel);
    const roleE = cardE?.child.role;
    if (!cardC || !cardD || !roleE) throw new Error();

    test('mana-wyrm-trigger', async () => {
        // Check initial stats
        expect(roleE.child.attack.state.current).toBe(1);
        expect(roleE.child.health.state.current).toBe(3);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.spells.length).toBe(1);

        // Player A casts a spell
        await cardC.play();

        // Mana Wyrm should gain +1 Attack
        expect(roleE.child.attack.state.current).toBe(2); // 1 + 1
        expect(roleE.child.attack.state.offset).toBe(1);
        expect(roleE.child.health.state.current).toBe(3); // unchanged
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 cost
        expect(handA.child.spells.length).toBe(0);
    })

    test('arcane-explosion-cast', async () => {
        const turn = game.child.turn;
        turn.next();
        
        // Check initial stats
        expect(roleE.child.attack.state.current).toBe(2);
        expect(roleE.child.attack.state.offset).toBe(1);
        expect(playerB.child.mana.state.current).toBe(10);
        expect(handB.child.spells.length).toBe(1);

        // Player B casts a spell
        await cardD.play();

        // Mana Wyrm should NOT gain Attack (enemy spell)
        expect(roleE.child.attack.state.current).toBe(2); // unchanged
        expect(roleE.child.attack.state.offset).toBe(1);
        expect(roleE.child.health.state.current).toBe(2); 
        expect(roleE.child.health.state.damage).toBe(1);
        expect(roleE.child.health.state.maxium).toBe(3);
        expect(playerB.child.mana.state.current).toBe(8); // 10 - 2 cost
        expect(handB.child.spells.length).toBe(0);
    })
})
