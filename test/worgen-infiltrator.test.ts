// Test scenario:
// Initial setup: Player A has Wisp on board, Player B has Worgen Infiltrator on board
// Test case 1: Player A's Wisp attacks, can only attack Player B's hero
// Test case 2: Turn switches, Player B uses Worgen to attack Player A's hero, Worgen's stealth status disappears
// Test case 3: Turn switches, Player A's Wisp attacks again, can attack Worgen, attacks Worgen

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil, DeathStatus } from "hearthstone-core";
import { WorgenInfiltratorCardModel } from "../src/worgen-infiltrator";
import { WispCardModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('worgen-infiltrator', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new WispCardModel({})] }
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
                        child: { cards: [new WorgenInfiltratorCardModel({})] }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
                    })
                }
            })
        }
    }));

    test('stealth', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof WispCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof WorgenInfiltratorCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        const heroB = game.child.playerB.child.hero.child.role;

        
        expect(boardA.child.cards.length).toBe(1);
        expect(boardB.child.cards.length).toBe(1);
        expect(roleB.child.entries.child.stealth.state.isActive).toBe(true);
        
        // Wisp attacks, can only attack hero due to stealth
        let promise = roleA.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(heroB);
        expect(SelectUtil.current?.options).not.toContain(roleB);
        expect(SelectUtil.current?.options.length).toBe(1);
        SelectUtil.set(heroB);
        await promise;
        
        expect(heroB.state.health).toBe(29);
    })

    test('deactive', async () => {
        const turn = game.child.turn;
        turn.next();
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof WispCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof WorgenInfiltratorCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        const heroA = game.child.playerA.child.hero.child.role;
        
        expect(roleB.child.entries.child.stealth.state.isActive).toBe(true);
        
        // Worgen attacks hero, stealth disappears
        let promise = roleB.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(heroA);
        expect(SelectUtil.current?.options).toContain(roleA);
        expect(SelectUtil.current?.options.length).toBe(2);
        SelectUtil.set(heroA);
        await promise;
        
        expect(roleB.child.entries.child.stealth.state.isActive).toBe(false);
        expect(heroA.state.health).toBe(28);
    })

    test('no-stealth', async () => {
        const turn = game.child.turn;
        turn.next();
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof WispCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof WorgenInfiltratorCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        const heroB = game.child.playerB.child.hero.child.role;
        
        expect(roleB.child.entries.child.stealth.state.isActive).toBe(false);
        
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