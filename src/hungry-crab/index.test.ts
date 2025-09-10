/**
 * Test cases for Hungry Crab
 * 
 * 1. hungry-crab-play: Player A plays Hungry Crab, no battlecry trigger (no murlocs), Hungry Crab is 1/2
 * 2. hungry-crab-battlecry: Player B plays Murloc Raider, then Hungry Crab, battlecry triggers and Hungry Crab becomes 3/4
 */

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil, ManaModel } from "hearthstone-core";
import { HungryCrabModel } from ".";
import { WispModel } from "../wisp";
import { MurlocRaiderModel } from "../murloc-raider";
import { boot } from "../boot";

describe('hungry-crab', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new WispModel()] }
                    })),
                    hand: new HandModel(() => ({
                        child: { minions: [new HungryCrabModel()] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    hand: new HandModel(() => ({
                        child: { minions: [
                            new HungryCrabModel(),
                            new MurlocRaiderModel()
                        ]}
                    }))
                }
            }))
        }
    }));
    boot(game);
    const handA = game.child.playerA.child.hand;
    const boardA = game.child.playerA.child.board;
    const handB = game.child.playerB.child.hand;
    const boardB = game.child.playerB.child.board;
    const cardC = handA.child.minions.find((item: any) => item instanceof HungryCrabModel);
    const cardD = handB.child.minions.find((item: any) => item instanceof MurlocRaiderModel);
    const cardE = handB.child.minions.find((item: any) => item instanceof HungryCrabModel);
    const cardF = handB.child.minions.find((item: any) => item instanceof MurlocRaiderModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    const roleE = cardE?.child.role;
    const roleF = cardF?.child.role;
    if (!roleC || !roleD || !roleE || !roleF) throw new Error();
    const turn = game.child.turn;

    test('hungry-crab-play', async () => {

        expect(boardA.child.minions.length).toBe(1);

        let promise = cardC.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeUndefined();
        await promise;

        expect(boardA.child.minions.length).toBe(2);
        expect(roleC.state.attack).toBe(1);
        expect(roleC.child.attack.state.origin).toBe(1);
        expect(roleC.child.attack.state.offset).toBe(0);
        expect(roleC.child.attack.state.current).toBe(1);
        expect(roleC.state.health).toBe(2);

        expect(roleC.child.health.state.limit).toBe(2);
        expect(roleC.child.health.state.origin).toBe(2);
        expect(roleC.child.health.state.offset).toBe(0);
        expect(roleC.child.health.state.damage).toBe(0);
        expect(roleC.child.health.state.memory).toBe(2);
        expect(roleC.child.health.state.current).toBe(2);
    })

    test('hungry-crab-battlecry', async () => {
        expect(boardB.child.minions.length).toBe(0);
        turn.next();
        
        // Play Murloc Raider first
        let promise = cardF.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        expect(boardB.child.minions.length).toBe(1);

        // Play Hungry Crab and trigger battlecry
        promise = cardE.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleF);
        expect(SelectUtil.current?.options.length).toBe(1);
        console.log('xxx')
        SelectUtil.set(roleF);
        await promise;

        expect(cardF.child.dispose.state.isActive).toBe(true);
        expect(cardF.child.dispose.state.isLock).toBe(true);

        expect(boardB.child.minions.length).toBe(1);


        expect(roleE.child.attack.state.current).toBe(3);
        expect(roleE.child.attack.state.origin).toBe(1);
        expect(roleE.child.attack.state.offset).toBe(2);
        expect(roleE.child.attack.state.current).toBe(3);
        expect(roleE.state.health).toBe(4);

        expect(roleE.child.health.state.limit).toBe(4);
        expect(roleE.child.health.state.origin).toBe(2);
        expect(roleE.child.health.state.offset).toBe(2);
        expect(roleE.child.health.state.damage).toBe(0);
        expect(roleE.child.health.state.memory).toBe(4);
        expect(roleE.child.health.state.current).toBe(4);
    })
})
