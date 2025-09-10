/**
 * Test cases for Abusive Sergeant
 * 
 * 1. abusive-sergeant-play: Player A plays Abusive Sergeant without battlecry effect
 * 2. abusive-sergeant-battlecry: Player B plays Abusive Sergeant and uses battlecry to buff Player A's minion
 * 3. abusive-sergeant-buff-expire: Buff expires at turn end
 */

import { BoardModel, GameModel, HandModel, MageModel, ManaModel, PlayerModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { boot } from "../boot";
import { AbusiveSergeantModel } from ".";
import { WispModel } from "../wisp";

describe('abusive-sergeant', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    hand: new HandModel(() => ({
                        child: { 
                            minions: [
                                new AbusiveSergeantModel(),
                                new WispModel()
                            ] 
                        }
                    })),
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    hand: new HandModel(() => ({
                        child: { 
                            minions: [
                                new AbusiveSergeantModel(),
                                new WispModel()
                            ] 
                        }
                    })),
                }
            })),
        }
    }));
    boot(game);

    const turn = game.child.turn;
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const handB = game.child.playerB.child.hand;
    const cardC = handA.child.minions.find((item: any) => item instanceof AbusiveSergeantModel);
    const cardD = handA.child.minions.find((item: any) => item instanceof WispModel);
    const cardE = handB.child.minions.find((item: any) => item instanceof WispModel);
    const cardF = handB.child.minions.find((item: any) => item instanceof AbusiveSergeantModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    const roleE = cardE?.child.role;
    const roleF = cardF?.child.role;
    if (!roleC || !roleD || !roleE || !roleF) throw new Error();

    test('abusive-sergeant-play', async () => {
        expect(boardB.child.minions.length).toBe(0);
        expect(boardA.child.minions.length).toBe(0);

        let promise = cardC.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeUndefined();

        // Play both cards without battlecry effect
        expect(boardA.child.minions.length).toBe(1);
        promise = cardD.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(1);
        SelectUtil.set(1);
        await promise;
        
        expect(boardA.child.minions.length).toBe(2);
        expect(roleC.state.attack).toBe(2);
        expect(roleC.child.attack.state.offset).toBe(0);
        expect(roleC.child.attack.state.origin).toBe(2);
        expect(roleD.state.attack).toBe(1);
        expect(roleD.child.attack.state.offset).toBe(0);
        expect(roleD.child.attack.state.origin).toBe(1);
    })

    test('abusive-sergeant-battlecry', async () => {
        turn.next();
        let promise = cardE.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        expect(boardB.child.minions.length).toBe(1);

        // Play Abusive Sergeant with battlecry effect
        promise = cardF.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(0);
        expect(SelectUtil.current?.options.length).toBe(2);
        SelectUtil.set(0);
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(roleD);
        expect(SelectUtil.current?.options).toContain(roleE);
        expect(SelectUtil.current?.options).toContain(roleC);
        expect(SelectUtil.current?.options.length).toBe(3);
        SelectUtil.set(roleD);
        await promise;
        await TimeUtil.sleep();

        expect(boardA.child.minions.length).toBe(2);
        expect(boardB.child.minions.length).toBe(2);
        expect(roleD.state.attack).toBe(3);
        expect(roleD.child.attack.state.offset).toBe(2);
        expect(roleD.child.attack.state.origin).toBe(1);
        expect(roleE.state.attack).toBe(1);
    })

    test('abusive-sergeant-buff-expire', async () => {
        expect(roleD.state.attack).toBe(3);
        
        turn.next();
        expect(roleD.state.attack).toBe(1);
        expect(roleD.child.attack.state.offset).toBe(0);
        expect(roleD.child.attack.state.origin).toBe(1);
    })
})
