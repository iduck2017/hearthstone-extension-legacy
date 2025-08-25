// Test scenarios for Amani Berserker:
// Initial: Player A has Berserker on board and woodoo in hand, Player B has 2 wisps on board
// 1. Player A uses Berserker to attack wisp, wisp dies with health -1, Berserker gains attack power, health 2
// 2. Turn ends, Player B uses second wisp to attack Berserker, wisp dies with health -4, Berserker health 1
// 3. Turn ends, Player A plays woodoo to heal Berserker, Berserker loses attack power gain

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil, DeathStatus, ManaModel } from "hearthstone-core";
import { AmaniBerserkerModel } from "../src/amani-berserker";
import { WispModel } from "../src/wisp";
import { VoodooDoctorModel } from "../src/voodoo-doctor";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";
import { StonetuskBoarModel } from "../src";

DebugUtil.level = LogLevel.ERROR;
describe('amani-berserker', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
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
                    mana: new ManaModel({ state: { origin: 10 }}),
                    board: new BoardModel({
                        child: { cards: [
                            new WispModel({}),
                            new StonetuskBoarModel({})
                        ]}
                    })
                }
            })
        }
    }));
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const handB = game.child.playerB.child.hand;
    const turn = game.child.turn;
    const cardA = boardA.child.cards.find(item => item instanceof AmaniBerserkerModel);
    const cardB = boardB.child.cards.find(item => item instanceof WispModel);
    const cardD = boardB.child.cards.find(item => item instanceof StonetuskBoarModel);
    const cardC = handA.child.cards.find(item => item instanceof VoodooDoctorModel);
    const roleA = cardA?.child.minion;
    const roleB = cardB?.child.minion;
    const roleC = cardC?.child.minion;
    const roleD = cardD?.child.minion;
    if (!roleA || !roleB || !roleC || !roleD) throw new Error();

    test('amani-berserker-attack-wisp', async () => {
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

    test('stonetusk-boar-attack-amani-berserker', async () => {
        turn.next();

        // Player B uses second wisp to attack Berserker
        let promise = roleD.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleA);
        SelectUtil.set(roleA); 
        await promise;
        
        // Verify wisp dies with health -4
        expect(roleD.state.health).toBe(-4);
        expect(roleD.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(boardB.child.cards.length).toBe(0);
        
        // Verify Berserker has health 1 and maintains attack power
        expect(roleA.state.attack).toBe(5); // Still has +3 attack from being damaged
        expect(roleA.state.health).toBe(1);
        expect(roleA.child.health.state.damage).toBe(2);
    });

    test('voodoo-doctor-heal-amani-berserker', async () => {
        turn.next(); 
        
        // Player A plays woodoo to heal Berserker
        let promise = cardC.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleA);
        SelectUtil.set(roleA);
        await promise;
        
        // Verify Berserker is healed and loses attack power gain
        expect(roleA.state.attack).toBe(2); // Back to base attack
        expect(roleA.child.attack.state.offset).toBe(0);
        expect(roleA.child.attack.state.origin).toBe(2);
        expect(roleA.state.health).toBe(3); // Fully healed
        expect(roleA.child.health.state.damage).toBe(0);
    });
}); 