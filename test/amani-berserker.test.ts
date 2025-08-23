// Test scenarios for Amani Berserker:
// Initial: Player A has Berserker on board and woodoo in hand, Player B has 2 wisps on board
// 1. Player A uses Berserker to attack wisp, wisp dies with health -1, Berserker gains attack power, health 2
// 2. Turn ends, Player B uses second wisp to attack Berserker, wisp dies with health -4, Berserker health 1
// 3. Turn ends, Player A plays woodoo to heal Berserker, Berserker loses attack power gain

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil, DeathStatus } from "hearthstone-core";
import { AmaniBerserkerModel } from "../src/amani-berserker";
import { WispModel } from "../src/wisp";
import { VoodooDoctorModel } from "../src/voodoo-doctor";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('amani-berserker', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [new AmaniBerserkerModel({})] }
                    }),
                    hand: new HandModel({
                        child: { cards: [new VoodooDoctorModel({})] }
                    })
                }
            }),
            playerB: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [
                            new WispModel({}),
                            new WispModel({})
                        ]}
                    })
                }
            })
        }
    }));

    test('berserker-attacks-wisp', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof AmaniBerserkerModel);
        const cardB = boardB.child.cards.find(item => item instanceof WispModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA) return;
        if (!cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        
        // Player A uses Berserker to attack wisp
        let promise = roleA.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleB);
        SelectUtil.set(roleB);
        await promise;
        
        // Verify wisp dies with health -1
        expect(roleB.state.health).toBe(-1);
        expect(roleB.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(boardB.child.cards.length).toBe(1);
        
        // Verify Berserker gains attack power and has health 2
        expect(roleA.state.attack).toBe(5); // 2 base + 3 from enrage
        expect(roleA.child.attack.state.offset).toBe(3);
        expect(roleA.child.attack.state.origin).toBe(2);
        expect(roleA.state.health).toBe(2);
        expect(roleA.child.health.state.damage).toBe(1);
    });

    test('wisp-attacks-berserker', async () => {
        const turn = game.child.turn;
        turn.next(); // End turn to give control to Player B
        
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof AmaniBerserkerModel);
        const cardB = boardB.child.cards.find(item => item instanceof WispModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA) return;
        if (!cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        
        // Player B uses second wisp to attack Berserker
        let promise = roleB.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleA);
        SelectUtil.set(roleA);
        await promise;
        
        // Verify wisp dies with health -4
        expect(roleB.state.health).toBe(-4);
        expect(roleB.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(boardB.child.cards.length).toBe(0);
        
        // Verify Berserker has health 1 and maintains attack power
        expect(roleA.state.attack).toBe(5); // Still has +3 attack from being damaged
        expect(roleA.state.health).toBe(1);
        expect(roleA.child.health.state.damage).toBe(2);
    });

    test('voodoo-doctor-heals-berserker', async () => {
        const turn = game.child.turn;
        turn.next(); // End turn to give control back to Player A
        
        const handA = game.child.playerA.child.hand;
        const boardA = game.child.playerA.child.board;
        const cardA = handA.child.cards.find(item => item instanceof VoodooDoctorModel);
        const cardB = boardA.child.cards.find(item => item instanceof AmaniBerserkerModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA) return;
        if (!cardB) return;
        const roleB = cardB.child.role;
        
        // Player A plays woodoo to heal Berserker
        let promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleB);
        SelectUtil.set(roleB);
        await promise;
        
        // Verify Berserker is healed and loses attack power gain
        expect(roleB.state.attack).toBe(2); // Back to base attack
        expect(roleB.child.attack.state.offset).toBe(0);
        expect(roleB.child.attack.state.origin).toBe(2);
        expect(roleB.state.health).toBe(3); // Fully healed
        expect(roleB.child.health.state.damage).toBe(0);
    });
}); 