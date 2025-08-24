/*
Test scenarios for Knife Juggler:

Initial: Player A has juggler, wisp and stonetuskboar in hand, Player B has wisp in hand
1. Player A plays stonetuskboar, Player B health is 30
2. Player A plays juggler, then plays wisp, juggler deals 1 damage to Player B, health becomes 29
3. Turn ends, Player B plays wisp, health remains 29
*/

import { GameModel, PlayerModel, HandModel, BoardModel, MageModel, TimeUtil, SelectUtil, DeathStatus } from "hearthstone-core";
import { KnifeJugglerModel } from "../src/knife-juggler";   
import { WispModel } from "../src/wisp";
import { StonetuskBoarModel } from "../src/stonetusk-boar";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('knife-juggler', () => {
    const game = new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    hand: new HandModel({
                        child: { 
                            cards: [
                                new KnifeJugglerModel({}),
                                new WispModel({}),
                                new StonetuskBoarModel({})
                            ] 
                        }
                    }),
                }
            }),
            playerB: new MageModel({
                child: {
                    hand: new HandModel({
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
    const cardA = handA.child.cards.find(item => item instanceof StonetuskBoarModel);
    const cardB = handA.child.cards.find(item => item instanceof KnifeJugglerModel);
    const cardC = handA.child.cards.find(item => item instanceof WispModel);
    const cardD = handB.child.cards.find(item => item instanceof WispModel);
    const roleA = cardA?.child.minion;
    const roleB = cardB?.child.minion;
    const roleC = cardC?.child.minion;
    const roleD = cardD?.child.minion;
    const roleE = game.child.playerB.child.role;
    if (!roleA || !roleB || !roleC || !roleD) throw new Error();


    test('stonetuskboar-play', async () => {
        // Check initial state
        expect(handA.child.cards.length).toBe(3);
        expect(boardA.child.cards.length).toBe(0);
        expect(roleE.state.health).toBe(30);
        
        // Play stonetuskboar
        const promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options.length).toBe(1);
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        
        // Check final state
        expect(handA.child.cards.length).toBe(2);
        expect(boardA.child.cards.length).toBe(1);
        expect(roleE.state.health).toBe(30); // No damage dealt
    })

    test('juggler-wisp-effect', async () => {
        // Check initial state
        expect(handA.child.cards.length).toBe(2);
        expect(boardA.child.cards.length).toBe(1);
        expect(roleE.state.health).toBe(30);
        
        // Play juggler first
        let promise = cardB.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        SelectUtil.set(0);
        await promise;
        
        // Check state after juggler
        expect(handA.child.cards.length).toBe(1);
        expect(boardA.child.cards.length).toBe(2);
        expect(roleE.state.health).toBe(30); // No damage yet
        
        // Play wisp to trigger juggler effect
        promise = cardC.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        SelectUtil.set(0);
        await promise;
        
        // Check final state - juggler should have dealt 1 damage
        expect(handA.child.cards.length).toBe(0);
        expect(boardA.child.cards.length).toBe(3);
        expect(roleE.state.health).toBe(29); // 1 damage dealt by juggler
    })

    test('wisp-play', async () => {
        // Check initial state
        expect(handB.child.cards.length).toBe(1);
        expect(boardB.child.cards.length).toBe(0);
        expect(roleE.state.health).toBe(29);
        
        // End turn to give control to player B
        game.child.turn.next();
        
        // Play wisp as player B
        const promise = cardD.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options.length).toBe(1);
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        
        // Check final state - no damage should be dealt since juggler is on player A's board
        expect(handB.child.cards.length).toBe(0);
        expect(boardB.child.cards.length).toBe(1);
        expect(roleE.state.health).toBe(29); // Health remains the same
    })
}) 