/**
 * Test cases for Hungry Crab
 * 
 * 1. hungry-crab-play: Player A plays Hungry Crab, no battlecry trigger (no murlocs), Hungry Crab is 1/2
 * 2. hungry-crab-battlecry: Player B plays Murloc Raider, then Hungry Crab, battlecry triggers and Hungry Crab becomes 3/4
 */

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, AnimeUtil, ManaModel } from "hearthstone-core";
import { HungryCrabModel } from ".";
import { WispModel } from "../wisp";
import { MurlocRaiderModel } from "../murloc-raider";
import { boot } from "../boot";

describe('hungry-crab', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [new WispModel()] }
                    }),
                    hand: new HandModel({
                        child: { minions: [new HungryCrabModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    hand: new HandModel({
                        child: { minions: [
                            new HungryCrabModel(),
                            new MurlocRaiderModel()
                        ]}
                    })
                }
            })
        }
    });
    boot(game);
    const handA = game.child.playerA.child.hand;
    const boardA = game.child.playerA.child.board;
    const handB = game.child.playerB.child.hand;
    const boardB = game.child.playerB.child.board;
    const cardC = handA.child.minions.find((item: any) => item instanceof HungryCrabModel);
    const cardD = boardA.child.minions.find((item: any) => item instanceof WispModel);
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
        await AnimeUtil.sleep();
        expect(game.child.playerA.child.controller.current?.options).toContain(0);
        game.child.playerA.child.controller.set(0);
        await AnimeUtil.sleep();
        expect(game.child.playerA.child.controller.current).toBeUndefined();
        await promise;

        expect(boardA.child.minions.length).toBe(2);
        expect(roleC.child.attack.state.current).toBe(1); // Hungry Crab
        expect(roleC.child.attack.state.origin).toBe(1);
        expect(roleC.child.attack.state.current).toBe(1);

        expect(roleC.child.health.state.maximum).toBe(2);
        expect(roleC.child.health.state.origin).toBe(2);
        expect(roleC.child.health.state.damage).toBe(0);
        expect(roleC.child.health.state.memory).toBe(2);
        expect(roleC.child.health.state.current).toBe(2);
    })

    test('hungry-crab-battlecry', async () => {
        expect(boardB.child.minions.length).toBe(0);
        turn.next();
        
        // Play Murloc Raider first
        let promise = cardF.play();
        await AnimeUtil.sleep();
        expect(game.child.playerB.child.controller.current?.options).toContain(0);
        game.child.playerB.child.controller.set(0);
        await promise;
        expect(boardB.child.minions.length).toBe(1);

        // Play Hungry Crab and trigger battlecry
        promise = cardE.play();
        await AnimeUtil.sleep();
        expect(game.child.playerB.child.controller.current?.options).toContain(0);
        game.child.playerB.child.controller.set(0);
        await AnimeUtil.sleep();
        expect(game.child.playerB.child.controller.current?.options).toContain(roleF);
        expect(game.child.playerB.child.controller.current?.options.length).toBe(1);
        game.child.playerB.child.controller.set(roleF);
        await promise;

        expect(cardF.child.dispose.status).toBe(true); // Murloc Raider destroyed
        expect(cardF.child.dispose.state.isLock).toBe(true);

        expect(boardB.child.minions.length).toBe(1); 

        expect(roleE.child.attack.state.current).toBe(3); // Hungry Crab +2/+2
        expect(roleE.child.attack.state.origin).toBe(1);
        expect(roleE.child.attack.state.current).toBe(3);

        expect(roleE.child.health.state.maximum).toBe(4); 
        expect(roleE.child.health.state.origin).toBe(2);
        expect(roleE.child.health.state.damage).toBe(0);
        expect(roleE.child.health.state.memory).toBe(4);
        expect(roleE.child.health.state.current).toBe(4);
    })
})
