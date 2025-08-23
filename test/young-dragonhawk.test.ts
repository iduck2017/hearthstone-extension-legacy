// Test scenario:
// Initial setup: Player A has Young Dragonhawk on board, Player B has Shieldbearer on board
// Test case: Player A uses Dragonhawk to attack Shieldbearer, can attack twice then cannot attack

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil } from "hearthstone-core";
import { YoungDragonhawkModel } from "../src/young-dragonhawk";
import { ShieldbearerModel } from "../src/shieldbearer";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('young-dragonhawk', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new YoungDragonhawkModel({})] }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new ShieldbearerModel({})] }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
                    })
                }
            })
        }
    }));

    test('windfury', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof YoungDragonhawkModel);
        const cardB = boardB.child.cards.find(item => item instanceof ShieldbearerModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        
        expect(boardA.child.cards.length).toBe(1);
        expect(boardB.child.cards.length).toBe(1);
        expect(roleA.state.action).toBe(2);
        expect(roleB.state.health).toBe(4);
        
        // First attack
        let promise = roleA.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options.length).toBe(1);
        SelectUtil.set(roleB);
        await promise;
        
        expect(roleA.child.action.state.origin).toBe(2);
        expect(roleA.state.action).toBe(1);
        expect(roleB.state.health).toBe(3);
        
        // Second attack
        promise = roleA.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options.length).toBe(1);
        SelectUtil.set(roleB);
        await promise;
        
        expect(roleA.child.action.state.origin).toBe(2);
        expect(roleA.state.action).toBe(0);
        expect(roleB.state.health).toBe(2);
        
        // Cannot attack anymore
        expect(roleA.child.action.check()).toBe(false);
    })
}) 