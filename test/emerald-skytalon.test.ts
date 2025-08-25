/**
 * Test cases for Emerald Skytalon
 * 
 * Requirements:
 * 1. start: Player A has 2 emerald skytalons in hand, Player B has 2 wisps on board, turn starts (nextTurn)
 * 2. rush: Player A plays 2 emerald skytalons, they can attack immediately but only target wisps (not Player B hero), one emerald attacks one wisp, the other doesn't move
 * 3. attack: After 2 turns, the other emerald can attack the hero
 */
import { GameModel, PlayerModel, MageModel, HandModel, BoardModel, SelectUtil, TimeUtil, RushStatus, ActionModel, ManaModel } from "hearthstone-core";
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
                    mana: new ManaModel({ state: { origin: 10 }}),
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
                    mana: new ManaModel({ state: { origin: 10 }}),
                    board: new BoardModel({
                        child: { cards: [new WispModel({})]}
                    })
                }
            })
        }
    })
    boot(game);
    const handA = game.child.playerA.child.hand;
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const cardA = handA.child.cards.find(item => item instanceof EmeraldSkytalonModel);
    const cardB = handA.child.cards.find(item => item instanceof WispModel);
    const cardC = boardB.child.cards.find(item => item instanceof WispModel);
    const roleA = cardA?.child.minion;
    const roleB = cardB?.child.minion;
    const roleC = cardC?.child.minion;
    if (!roleA || !roleB || !roleC) throw new Error();
    const turn = game.child.turn;
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const roleD = playerB.child.role;

    test('emerald-skytalon-rush', async () => {
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

        expect(SelectUtil.current?.options).toContain(roleC);
        expect(SelectUtil.current?.options).not.toContain(roleD);
        SelectUtil.set(undefined);
        await promise;
        expect(roleA.state.action).toBe(1);        
    })


    test('wisp-play', async () => {
        let promise = cardB.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(1);
        SelectUtil.set(1);
        await promise;

        expect(boardA.child.cards.length).toBe(2);
        expect(roleB.state.action).toBe(1);
        expect(roleB.child.sleep.state.status).toBe(true);
        expect(roleB.child.entries.child.rush.state.status).toBe(RushStatus.INACTIVE);
        promise = roleB.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeUndefined();
    })


    test('emerald-skytalon-attack-wisp', async () => {
        const turn = game.child.turn;
        const playerA = game.child.playerA;
        const playerB = game.child.playerB;
        expect(turn.refer.current).toBe(playerA);
        await turn.next();
        expect(turn.refer.current).toBe(playerB);
        await turn.next();
        expect(turn.refer.current).toBe(playerA);

        expect(roleA.child.sleep.state.status).toBe(false);
        expect(roleA.state.action).toBe(1);
        expect(roleA.child.entries.child.rush.state.status).toBe(RushStatus.ACTIVE_ONCE);
        expect(roleB.child.sleep.state.status).toBe(false);
        expect(roleB.state.action).toBe(1);
        expect(roleB.child.entries.child.rush.state.status).toBe(RushStatus.INACTIVE);

        let promise = roleA.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleC);
        expect(SelectUtil.current?.options).toContain(roleD);
        SelectUtil.set(roleD);
        await promise;

        expect(roleD.state.health).toBe(28);
        expect(roleA.state.action).toBe(0);

        promise = roleB.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleC);
        expect(SelectUtil.current?.options).toContain(roleD);
        SelectUtil.set(roleD);
        await promise;
        expect(roleD.state.health).toBe(27);
        expect(roleA.state.action).toBe(0);
    });

})
