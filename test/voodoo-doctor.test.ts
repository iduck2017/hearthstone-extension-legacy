// Test scenario:
// Initial setup: Player A has Voodoo Doctor in hand and Wisp on board, Player B has Shieldbearer on board
// Test case 1: Player A's Wisp attacks Player B's Shieldbearer, latter loses 1 health
// Test case 2: Player A plays Voodoo Doctor, target selection should include all roles, choose Shieldbearer, it restores 1 health

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil } from "hearthstone-core";
import { VoodooDoctorCardModel } from "../src/voodoo-doctor";
import { WispCardModel } from "../src/wisp";
import { ShieldbearerCardModel } from "../src/shieldbearer";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('voodoo-doctor', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new WispCardModel({})] }
                    }),
                    hand: new HandModel({
                        child: { cards: [new VoodooDoctorCardModel({})] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new ShieldbearerCardModel({})] }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
                    })
                }
            })
        }
    }));

    test('attack', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof WispCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof ShieldbearerCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        const heroB = game.child.playerB.child.hero.child.role;
        
        expect(boardA.child.cards.length).toBe(1);
        expect(boardB.child.cards.length).toBe(1);
        expect(roleB.state.health).toBe(4);
        
        // Wisp attacks Shieldbearer
        let promise = roleA.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options.length).toBe(1);
        SelectUtil.set(roleB);
        await promise;
        
        expect(roleB.state.health).toBe(3);
        expect(roleB.child.health.state.damage).toBe(1);
    })

    test('battlecry', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const handA = game.child.playerA.child.hand;
        const cardA = boardA.child.cards.find(item => item instanceof WispCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof ShieldbearerCardModel);
        const cardC = handA.child.cards.find(item => item instanceof VoodooDoctorCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        expect(cardC).toBeDefined();
        if (!cardA || !cardB || !cardC) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        const roleC = cardC.child.role;
        const heroA = game.child.playerA.child.hero.child.role;
        const heroB = game.child.playerB.child.hero.child.role;
        
        // Play Voodoo Doctor
        let promise = cardC.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await TimeUtil.sleep();
        console.log(SelectUtil.current);
        expect(SelectUtil.current?.options).toContain(roleA);
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options).toContain(heroA);
        expect(SelectUtil.current?.options).toContain(heroB);
        expect(SelectUtil.current?.options).not.toContain(roleC);
        expect(SelectUtil.current?.options.length).toBe(4);
        SelectUtil.set(roleB);
        await promise;
        
        expect(boardA.child.cards.length).toBe(2);
        expect(roleB.state.health).toBe(4);
        expect(roleB.child.health.state.damage).toBe(0);
        expect(roleB.child.health.state.origin).toBe(4);
        expect(roleB.child.health.state.memory).toBe(4);
        expect(roleB.child.health.state.limit).toBe(4);
    })
}) 