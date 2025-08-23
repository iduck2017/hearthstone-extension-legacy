// Test scenario:
// Initial setup: Player A has Wisp on board, Young Priestess in hand
// Test case 1: First turn ends, Wisp health remains 1
// Test case 2: Third turn, play Priestess, turn ends, Wisp health becomes 2
// Test case 3: Fifth turn ends, Wisp health becomes 3

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil } from "hearthstone-core";
import { YoungPriestessModel } from "../src/young-priestess";
import { WispModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('young-priestess', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [new WispModel({})] }
                    }),
                    hand: new HandModel({
                        child: { cards: [new YoungPriestessModel({})] }
                    })
                }
            }),
            playerB: new MageModel({})
        }
    }));

    test('first-turn', async () => {
        const boardA = game.child.playerA.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof WispModel);
        expect(cardA).toBeDefined();
        if (!cardA) return;
        const roleA = cardA.child.role;
        
        expect(roleA.state.health).toBe(1);
        expect(roleA.child.health.state.origin).toBe(1);
        expect(roleA.child.health.state.offset).toBe(0);
        
        // End first turn
        const turn = game.child.turn;
        turn.next();
        
        expect(roleA.state.health).toBe(1);
        expect(roleA.child.health.state.origin).toBe(1);
        expect(roleA.child.health.state.offset).toBe(0);
    })

    test('second-turn', async () => {
        // End turn
        const turn = game.child.turn;
        turn.next();

        const boardA = game.child.playerA.child.board;
        const handA = game.child.playerA.child.hand;
        const cardA = boardA.child.cards.find(item => item instanceof WispModel);
        const cardB = handA.child.cards.find(item => item instanceof YoungPriestessModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        const roleA = cardA.child.role;
        
        expect(roleA.state.health).toBe(1);
        expect(roleA.child.health.state.origin).toBe(1);
        expect(roleA.child.health.state.offset).toBe(0);
        
        // Play Young Priestess
        let promise = cardB.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        
        expect(boardA.child.cards.length).toBe(2);
        expect(roleA.state.health).toBe(1);
        expect(roleA.child.health.state.origin).toBe(1);
        expect(roleA.child.health.state.offset).toBe(0);
        
        turn.next();
        expect(roleA.state.health).toBe(2);
        expect(roleA.child.health.state.origin).toBe(1);
        expect(roleA.child.health.state.offset).toBe(1);
    })

    test('third-turn', async () => {
        // End turn
        const turn = game.child.turn;
        turn.next();

        const boardA = game.child.playerA.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof WispModel);
        expect(cardA).toBeDefined();
        if (!cardA) return;
        const roleA = cardA.child.role;
        
        expect(roleA.state.health).toBe(2);
        expect(roleA.child.health.state.origin).toBe(1);
        expect(roleA.child.health.state.offset).toBe(1);
        
        // End fifth turn
        turn.next();
        
        expect(roleA.state.health).toBe(3);
        expect(roleA.child.health.state.origin).toBe(1);
        expect(roleA.child.health.state.offset).toBe(2);
    })
}) 