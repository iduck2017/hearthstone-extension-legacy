/**
 * Test cases for Emerald Skytalon
 * 
 * Requirements:
 * 1. start: Player A has 2 emerald skytalons in hand, Player B has 2 wisps on board, turn starts (nextTurn)
 * 2. rush: Player A plays 2 emerald skytalons, they can attack immediately but only target wisps (not Player B hero), one emerald attacks one wisp, the other doesn't move
 * 3. attack: After 2 turns, the other emerald can attack the hero
 */
import { GameModel, PlayerModel, MageModel, HandModel, BoardModel, SelectUtil, TimeUtil, RushStatus, ActionModel } from "hearthstone-core";
import { EmeraldSkytalonModel } from "../src/emerald-skytalon";
import { WispModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('emerald-skytalon', () => {
    const game = new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    hand: new HandModel({
                        child: { cards: [
                            new EmeraldSkytalonModel({}),
                            new WispModel({})
                        ]}
                    }),
                }
            }),
            playerB: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [new WispModel({})]}
                    })
                }
            })
        }
    })
    boot(game);

    test('emerald-skytalon-rush-attack', async () => {
        const handA = game.child.playerA.child.hand;
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = handA.child.cards.find(item => item instanceof EmeraldSkytalonModel);
        const cardB = boardB.child.cards.find(item => item instanceof WispModel);
        expect(cardA).toBeDefined();
        if (!cardA) return;
        if (!cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        const turn = game.child.turn;
        const playerA = game.child.playerA;
        const playerB = game.child.playerB
        let promise = cardA.play()
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        expect(boardA.child.cards.length).toBe(1);
        expect(turn.refer.current).toBe(playerA);
        expect(roleA.state.attack).toBe(2);
        expect(roleA.state.health).toBe(1);
        expect(roleA.state.action).toBe(1);
        expect(roleA.child.sleep.state.status).toBe(false);
        expect(roleA.child.entries.child.rush.state.status).toBe(RushStatus.ACTIVE);
        promise = roleA.child.action.run()
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options).not.toContain(playerB);
        SelectUtil.set(undefined);
        await promise;
        expect(roleA.state.action).toBe(1);        
    })


    test('wisp-play-and-sleep', async () => {
        const handA = game.child.playerA.child.hand;
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = handA.child.cards.find(item => item instanceof WispModel);
        const cardB = boardB.child.cards.find(item => item instanceof WispModel);
        expect(cardA).toBeDefined();
        if (!cardA) return;
        if (!cardB) return;
        const roleA = cardA.child.role;
        let promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(1);
        SelectUtil.set(1);
        await promise;
        expect(boardA.child.cards.length).toBe(2);
        expect(roleA.state.action).toBe(1);
        expect(roleA.child.sleep.state.status).toBe(true);
        expect(roleA.child.entries.child.rush.state.status).toBe(RushStatus.INACTIVE);
        promise = roleA.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeUndefined();
    })


    test('emerald-skytalon-attacks-wisp', async () => {
        const turn = game.child.turn;
        const playerA = game.child.playerA;
        const playerB = game.child.playerB;
        expect(turn.refer.current).toBe(playerA);
        await turn.next();
        expect(turn.refer.current).toBe(playerB);
        await turn.next();
        expect(turn.refer.current).toBe(playerA);
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof EmeraldSkytalonModel);
        const cardB = boardA.child.cards.find(item => item instanceof WispModel);
        const cardC = boardB.child.cards.find(item => item instanceof WispModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        expect(cardC).toBeDefined();
        if (!cardA) return;
        if (!cardB) return;
        if (!cardC) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        const roleC = cardC.child.role;
        expect(roleA.child.sleep.state.status).toBe(false);
        expect(roleA.state.action).toBe(1);
        expect(roleA.child.entries.child.rush.state.status).toBe(RushStatus.ACTIVE_ONCE);
        expect(roleB.child.sleep.state.status).toBe(false);
        expect(roleB.state.action).toBe(1);
        expect(roleB.child.entries.child.rush.state.status).toBe(RushStatus.INACTIVE);
        let promise = roleA.child.action.run();
        await TimeUtil.sleep();
        const heroB = playerB.child.role;
        expect(SelectUtil.current?.options).toContain(roleC);
        expect(SelectUtil.current?.options).toContain(heroB);
        SelectUtil.set(heroB);
        await promise;
        expect(heroB.state.health).toBe(28);
        expect(roleA.state.action).toBe(0);
        promise = roleB.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleC);
        expect(SelectUtil.current?.options).toContain(heroB);
        SelectUtil.set(heroB);
        await promise;
        expect(heroB.state.health).toBe(27);
        expect(roleA.state.action).toBe(0);
    });

})
