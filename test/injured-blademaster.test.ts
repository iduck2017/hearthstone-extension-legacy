/*
Test scenario for Injured Blademaster:

Initial: Player A has Blademaster and Voodoo Doctor in hand, Player B has Wisp on board
1. Player A plays Blademaster, health becomes 3, max health is 7
2. Player A plays Voodoo Doctor to heal Blademaster, health becomes 5, max health is 7
3. Turn ends, Player B uses Wisp to attack Blademaster, Blademaster health becomes 4, Wisp health becomes -3
*/

import { GameModel, BoardModel, HandModel, MageModel, TimeUtil, SelectUtil, ManaModel } from "hearthstone-core";
import { InjuredBlademasterModel } from "../src/injured-blademaster";
import { VoodooDoctorModel } from "../src/voodoo-doctor";
import { WispModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('injured-blademaster', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [
                                new InjuredBlademasterModel({}),
                                new VoodooDoctorModel({})
                            ] 
                        }
                    }),
                }
            }),
            playerB: new MageModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    board: new BoardModel({
                        child: { cards: [new WispModel({})] }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
                    }),
                }
            })
        }
    }));
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const cardA = handA.child.cards.find(item => item instanceof InjuredBlademasterModel);
    const cardB = handA.child.cards.find(item => item instanceof VoodooDoctorModel);
    const cardC = boardB.child.cards.find(item => item instanceof WispModel);
    const roleA = cardA?.child.minion;
    const roleB = cardB?.child.minion;
    const roleC = cardC?.child.minion;
    if (!roleA || !roleB || !roleC) throw new Error();

    test('injured-blademaster-battlecry', async () => {
        // Check initial state
        expect(boardA.child.cards.length).toBe(0);
        expect(handA.child.cards.length).toBe(2);
        
        // Play Injured Blademaster
        const promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        
        // Check that Blademaster is on board and damaged
        expect(boardA.child.cards.length).toBe(1);
        expect(handA.child.cards.length).toBe(1);
        expect(roleA.state.health).toBe(3);
        expect(roleA.child.health.state.limit).toBe(7);
        expect(roleA.child.health.state.damage).toBe(4);
    })

    test('voodoo-doctor-heal', async () => {
        // Play Voodoo Doctor to heal Blademaster
        const promise = cardB.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleA);
        SelectUtil.set(roleA);
        await promise;
        
        // Check that Blademaster is healed
        expect(roleA.state.health).toBe(5);
        expect(roleA.child.health.state.limit).toBe(7);
        expect(roleA.child.health.state.damage).toBe(2);
    })

    test('wisp-attack', async () => {
        // End turn to give control to Player B
        game.child.turn.next();
        
        // Check that Player B's wisp can attack
        expect(roleC.state.action).toBe(1);
        
        // Wisp attacks Blademaster
        let promise = roleC.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleA);
        SelectUtil.set(roleA);
        await promise;
        
        // Check the result of the attack
        expect(roleA.state.health).toBe(4);
        expect(roleC.state.health).toBe(-3);
    })
}) 