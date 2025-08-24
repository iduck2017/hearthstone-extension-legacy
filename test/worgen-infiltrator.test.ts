// Test scenario:
// Initial setup: Player A has Wisp on board, Player B has Worgen Infiltrator on board
// Test case 1: Player A's Wisp attacks, can only attack Player B's hero
// Test case 2: Turn switches, Player B uses Worgen to attack Player A's hero, Worgen's stealth status disappears
// Test case 3: Turn switches, Player A's Wisp attacks again, can attack Worgen, attacks Worgen

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil, DeathStatus } from "hearthstone-core";
import { WorgenInfiltratorModel } from "../src/worgen-infiltrator";
import { WispModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('worgen-infiltrator', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [new WispModel({})] }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
                    })
                }
            }),
            playerB: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [new WorgenInfiltratorModel({})] }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
                    })
                }
            })
        }
    }));
    const turn = game.child.turn;
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const cardA = boardA.child.cards.find(item => item instanceof WispModel);
    const cardB = boardB.child.cards.find(item => item instanceof WorgenInfiltratorModel);
    const roleA = cardA?.child.minion;
    const roleB = cardB?.child.minion;
    const roleC = game.child.playerA.child.role;
    const roleD = game.child.playerB.child.role;
    if (!roleA || !roleB) throw new Error();

    test('worgen-infiltrator-stealth', async () => {
        expect(boardA.child.cards.length).toBe(1);
        expect(boardB.child.cards.length).toBe(1);
        expect(roleB.child.entries.child.stealth.state.status).toBe(1);
        
        // Wisp attacks, can only attack hero due to stealth
        let promise = roleA.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleD);
        expect(SelectUtil.current?.options).not.toContain(roleB);
        expect(SelectUtil.current?.options.length).toBe(1);
        SelectUtil.set(roleD);
        await promise;
        
        expect(roleD.state.health).toBe(29);
    })

    test('worgen-attacks', async () => {
        turn.next();
        
        expect(roleB.child.entries.child.stealth.state.status).toBe(1);
        
        // Worgen attacks hero, stealth disappears
        let promise = roleB.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleC);
        expect(SelectUtil.current?.options).toContain(roleA);
        expect(SelectUtil.current?.options.length).toBe(2);
        SelectUtil.set(roleC);
        await promise;
        
        expect(roleB.child.entries.child.stealth.state.status).toBe(0);
        expect(roleC.state.health).toBe(28);
    })

    test('wisp-can-attack-worgen', async () => {
        const turn = game.child.turn;
        turn.next();
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof WispModel);
        const cardB = boardB.child.cards.find(item => item instanceof WorgenInfiltratorModel);
        const roleA = cardA?.child.minion;
        const roleB = cardB?.child.minion;
        expect(roleA).toBeDefined();
        expect(roleB).toBeDefined();
        if (!roleA || !roleB) return;
        const heroB = game.child.playerB.child.role;
        
        expect(roleB.child.entries.child.stealth.state.status).toBe(0);
        
        // Wisp can now attack Worgen
        let promise = roleA.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options).toContain(heroB);
        expect(SelectUtil.current?.options.length).toBe(2);
        SelectUtil.set(roleB);
        await promise;
        
        expect(roleB.state.health).toBe(0);
        expect(roleA.state.health).toBe(-1);
        expect(roleB.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(roleA.child.death.state.status).toBe(DeathStatus.ACTIVE);
    })
}) 