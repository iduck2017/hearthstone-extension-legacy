
/*
 * Test scenarios for Amani Berserker:
 * Initial: Player A has Berserker on board and woodoo in hand, Player B has 2 wisps on board
 * 1. Player A uses Berserker to attack wisp, wisp dies with health -1, Berserker gains attack power, health 2
 * 2. Player B uses second wisp to attack Berserker, wisp dies with health -4, Berserker health 1
 * 3. Player A plays woodoo to heal Berserker, Berserker loses attack power gain
 */

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil, ManaModel } from "hearthstone-core";
import { AmaniBerserkerModel } from ".";
import { WispModel } from "../wisp";
import { VoodooDoctorModel } from "../voodoo-doctor";
import { boot } from "../boot";
import { DebugUtil, LogLevel } from "set-piece";
import { StonetuskBoarModel } from "../stonetusk-boar";

DebugUtil.level = LogLevel.ERROR;
describe('amani-berserker', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new AmaniBerserkerModel()] }
                    })),
                    hand: new HandModel(() => ({
                        child: { minions: [new VoodooDoctorModel()] }
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
                            new StonetuskBoarModel()
                        ]}
                    }))
                }
            })),
        }
    }));
    const root = boot(game);
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const handB = game.child.playerB.child.hand;
    const turn = game.child.turn;
    const cardC = boardA.child.minions.find((item: any) => item instanceof AmaniBerserkerModel);
    const cardD = boardB.child.minions.find((item: any) => item instanceof WispModel);
    const cardF = boardB.child.minions.find((item: any) => item instanceof StonetuskBoarModel);
    const cardE = handA.child.minions.find((item: any) => item instanceof VoodooDoctorModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    const roleE = cardE?.child.role;
    const roleF = cardF?.child.role;
    if (!roleC || !roleD || !roleE || !roleF) throw new Error();

    test('amani-berserker-attack', async () => {
        // Player A uses Berserker to attack wisp
        let promise = roleC.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleD);
        SelectUtil.set(roleD);
        await promise;
        
        // Verify wisp dies with health -1
        expect(roleD.state.health).toBe(-1);
        expect(cardD.child.dispose.state.isActive).toBe(true);
        expect(boardB.child.minions.length).toBe(1);
        
        // Verify Berserker gains attack power and has health 2
        expect(roleC.state.attack).toBe(5); // 2 base + 3 from enrage
        expect(roleC.child.attack.state.offset).toBe(3);
        expect(roleC.child.attack.state.origin).toBe(2);
        expect(roleC.state.health).toBe(2);
        expect(roleC.child.health.state.damage).toBe(1);
    });

    test('stonetusk-boar-attack', async () => {
        turn.next();

        // Player B uses second wisp to attack Berserker
        let promise = roleF.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleC);
        SelectUtil.set(roleC); 
        await promise;
        
        // Verify wisp dies with health -4
        expect(roleF.state.health).toBe(-4);
        expect(cardF.child.dispose.state.isActive).toBe(true);
        expect(boardB.child.minions.length).toBe(0);
        
        // Verify Berserker has health 1 and maintains attack power
        expect(roleC.state.attack).toBe(5); // Still has +3 attack from being damaged
        expect(roleC.state.health).toBe(1);
        expect(roleC.child.health.state.damage).toBe(2);
    });

    test('voodoo-doctor-heal', async () => {
        turn.next(); 
        
        // Player A plays woodoo to heal Berserker
        let promise = cardE.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleC);
        SelectUtil.set(roleC);
        await promise;
        
        // Verify Berserker is healed and loses attack power gain
        expect(roleC.state.attack).toBe(2); // Back to base attack
        expect(roleC.child.attack.state.offset).toBe(0);
        expect(roleC.child.attack.state.origin).toBe(2);
        expect(roleC.state.health).toBe(3); // Fully healed
        expect(roleC.child.health.state.damage).toBe(0);
    });
}); 