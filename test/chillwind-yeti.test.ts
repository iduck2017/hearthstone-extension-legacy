/*
Test scenario for Chillwind Yeti:
Initial: Player A has Chillwind Yeti in hand, Player B has Wisp on board
1. Player A has 10 mana, plays Chillwind Yeti, Yeti becomes 4/5, Player A has 6 mana remaining
2. Turn ends, Player B's Wisp attacks Yeti, Yeti becomes 4/4 with 1 damage, Wisp dies
*/

import { GameModel, PlayerModel, HandModel, BoardModel, MageModel, TimeUtil, SelectUtil, DeathStatus, ManaModel } from "hearthstone-core";
import { ChillwindYetiModel } from "../src/chillwind-yeti";   
import { WispModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('chillwind-yeti', () => {
    const game = new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hand: new HandModel({
                        child: { cards: [new ChillwindYetiModel({})] }
                    }),
                }
            }),
            playerB: new MageModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    board: new BoardModel({
                        child: { cards: [new WispModel({})] }
                    })
                }
            })
        }
    })
    boot(game);
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const handB = game.child.playerB.child.hand;
    const cardA = handA.child.cards.find(item => item instanceof ChillwindYetiModel);
    const cardB = boardB.child.cards.find(item => item instanceof WispModel);
    const roleA = cardA?.child.minion;
    const roleB = cardB?.child.minion;
    if (!roleA || !roleB) throw new Error();
    const playerA = game.child.playerA;
    const turn = game.child.turn;

    test('chillwind-yeti-play', async () => {
        // Check initial state
        expect(handA.child.cards.length).toBe(1);
        expect(boardB.child.cards.length).toBe(1);
        expect(boardA.child.cards.length).toBe(0);
        expect(playerA.child.mana.state.current).toBe(10);
        
        // Play Chillwind Yeti
        const promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options.length).toBe(1);
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        
        // Check that Yeti is on board with correct stats
        expect(boardA.child.cards.length).toBe(1);
        expect(handA.child.cards.length).toBe(0);
        expect(roleA.state.health).toBe(5);
        expect(roleA.child.health.state.limit).toBe(5);
        expect(roleA.child.attack.state.origin).toBe(4);
        
        // Check that Player A has 6 mana remaining
        expect(playerA.child.mana.state.current).toBe(6);
    })

    test('wisp-attack-yeti', async () => {
        // End turn to give Player B action
        turn.next();
        expect(roleB.state.action).toBe(1);
        
        // Wisp attacks Yeti
        const promise = roleB.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(roleA);
        expect(SelectUtil.current?.options.length).toBe(2);
        SelectUtil.set(roleA);
        await promise;
        
        // Check that Wisp is dead
        expect(roleB.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(boardB.child.cards.length).toBe(0);
        
        // Check that Yeti has 1 damage (4/4)
        expect(roleA.state.health).toBe(4);
        expect(roleA.child.health.state.damage).toBe(1);
        expect(boardA.child.cards.length).toBe(1);
    })
}) 