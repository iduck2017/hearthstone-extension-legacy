// Test scenarios for Ancient Watcher:
// Initial: Player A has Watcher in hand, Player B has wisp on board
// 1. Player A plays Watcher, cannot attack
// 2. After two turns, Watcher still cannot attack

import { GameModel, BoardModel, HandModel, MageModel, TimeUtil, SelectUtil } from "hearthstone-core";
import { AncientWatcherModel } from "../src/ancient-watcher";
import { WispModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('ancient-watcher', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    hand: new HandModel({
                        child: { cards: [new AncientWatcherModel({})] }
                    })
                }
            }),
            playerB: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [new WispModel({})] }
                    })
                }
            })
        }
    }));

    test('ancient-watcher-play-cannot-attack', async () => {
        const handA = game.child.playerA.child.hand;
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = handA.child.cards.find(item => item instanceof AncientWatcherModel);
        const cardB = boardB.child.cards.find(item => item instanceof WispModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA) return;
        if (!cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        
        // Player A plays Watcher
        let promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        
        expect(boardA.child.cards.length).toBe(1);
        expect(roleA.state.attack).toBe(4);
        expect(roleA.state.health).toBe(5);
        expect(roleA.state.action).toBe(1);
        
        // Verify Watcher cannot attack
        expect(roleA.child.action.check()).toBe(false);
        expect(roleA.child.action.state.status).toBe(false);
        
        // Try to attack and verify no options are available
        promise = roleA.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeUndefined();
        await promise;
    });

    test('ancient-watcher-still-cannot-attack-2', async () => {
        const boardA = game.child.playerA.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof AncientWatcherModel);
        expect(cardA).toBeDefined();
        if (!cardA) return;
        const roleA = cardA.child.role;
        
        // End first turn
        const turn = game.child.turn;
        turn.next();
        
        // Verify Watcher still cannot attack after turn change
        expect(roleA.child.action.check()).toBe(false);
        expect(roleA.child.action.state.status).toBe(false);
        
        // End second turn
        turn.next();
        
        // Verify Watcher still cannot attack after second turn change
        expect(roleA.child.action.check()).toBe(false);
        expect(roleA.child.action.state.status).toBe(false);
        expect(roleA.state.action).toBe(1);
    });
}); 