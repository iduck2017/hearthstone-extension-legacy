/**
 * Test cases for Hungry Crab
 * 
 * 1. hungry-crab-play: Player A plays Hungry Crab, no battlecry trigger (no murlocs), Hungry Crab is 1/2
 * 2. hungry-crab-battlecry: Player B plays Murloc Raider, then Hungry Crab, battlecry triggers and Hungry Crab becomes 3/4
 */

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, AnimeUtil, ManaModel } from "hearthstone-core";
import { HungryCrabModel } from ".";
import { WispModel } from '../../neutral/wisp';
import { MurlocRaiderModel } from "../murloc-raider";
import { boot } from '../../boot';

describe('hungry-crab', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new WispModel()] }
                    }),
                    hand: new HandModel({
                        child: { cards: [new HungryCrabModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    hand: new HandModel({
                        child: { cards: [
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
    const cardC = handA.child.cards.find((item: any) => item instanceof HungryCrabModel);
    const cardD = boardA.child.cards.find((item: any) => item instanceof WispModel);
    const cardE = handB.child.cards.find((item: any) => item instanceof HungryCrabModel);
    const cardF = handB.child.cards.find((item: any) => item instanceof MurlocRaiderModel);
    if (!cardC || !cardD || !cardE || !cardF) throw new Error();
    const turn = game.child.turn;

    test('hungry-crab-play', async () => {

        expect(boardA.child.cards.length).toBe(1);

        let promise = cardC.play();
        await AnimeUtil.sleep();
        expect(game.child.playerA.child.controller.current?.options).toContain(0);
        game.child.playerA.child.controller.set(0);
        await AnimeUtil.sleep();
        expect(game.child.playerA.child.controller.current).toBeUndefined();
        await promise;

        const crabOnBoard = boardA.child.cards.find((item: any) => item instanceof HungryCrabModel);
        if (!crabOnBoard) throw new Error();
        
        expect(boardA.child.cards.length).toBe(2);
        expect(crabOnBoard.child.attack.state.current).toBe(1); // Hungry Crab
        expect(crabOnBoard.child.attack.state.origin).toBe(1);
        expect(crabOnBoard.child.attack.state.current).toBe(1);

        expect(crabOnBoard.child.health.state.maximum).toBe(2);
        expect(crabOnBoard.child.health.state.origin).toBe(2);
        expect(crabOnBoard.child.health.state.damage).toBe(0);
        expect(crabOnBoard.child.health.state.memory).toBe(2);
        expect(crabOnBoard.child.health.state.current).toBe(2);
    })

    test('hungry-crab-battlecry', async () => {
        expect(boardB.child.cards.length).toBe(0);
        turn.next();
        
        // Play Murloc Raider first
        let promise = cardF.play();
        await AnimeUtil.sleep();
        expect(game.child.playerB.child.controller.current?.options).toContain(0);
        game.child.playerB.child.controller.set(0);
        await promise;
        expect(boardB.child.cards.length).toBe(1);

        // Play Hungry Crab and trigger battlecry
        promise = cardE.play();
        await AnimeUtil.sleep();
        expect(game.child.playerB.child.controller.current?.options).toContain(0);
        game.child.playerB.child.controller.set(0);
        await AnimeUtil.sleep();
        
        const murlocOnBoard = boardB.child.cards.find((item: any) => item instanceof MurlocRaiderModel);
        if (!murlocOnBoard) throw new Error();
        
        expect(game.child.playerB.child.controller.current?.options).toContain(murlocOnBoard);
        expect(game.child.playerB.child.controller.current?.options.length).toBe(1);
        game.child.playerB.child.controller.set(murlocOnBoard);
        await promise;

        expect(murlocOnBoard.child.dispose.status).toBe(true); // Murloc Raider destroyed
        expect(murlocOnBoard.child.dispose.state.isLock).toBe(true);

        expect(boardB.child.cards.length).toBe(1); 

        const crabOnBoard = boardB.child.cards.find((item: any) => item instanceof HungryCrabModel);
        if (!crabOnBoard) throw new Error();
        
        expect(crabOnBoard.child.attack.state.current).toBe(3); // Hungry Crab +2/+2
        expect(crabOnBoard.child.attack.state.origin).toBe(1);
        expect(crabOnBoard.child.attack.state.current).toBe(3);

        expect(crabOnBoard.child.health.state.maximum).toBe(4); 
        expect(crabOnBoard.child.health.state.origin).toBe(2);
        expect(crabOnBoard.child.health.state.damage).toBe(0);
        expect(crabOnBoard.child.health.state.memory).toBe(4);
        expect(crabOnBoard.child.health.state.current).toBe(4);
    })
})
