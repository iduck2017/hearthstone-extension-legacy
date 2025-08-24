// Test scenarios:
// Initial setup: Player A has Hungry Crab in hand and Wisp on board
// Player B has Hungry Crab and Murloc Raider in hand
// Test case 1: Player A plays Hungry Crab, only needs to set position, no battlecry trigger, Hungry Crab is 1/2
// Test case 2: Turn switches, Player B plays Raider first, then plays Hungry Crab, target selection only includes Raider, Hungry Crab becomes 3/4

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil } from "hearthstone-core";
import { HungryCrabModel } from "../src/hungry-crab";
import { WispModel } from "../src/wisp";
import { MurlocRaiderCard } from "../src/murloc-raider";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('hungry-crab', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [new WispModel({})] }
                    }),
                    hand: new HandModel({
                        child: { cards: [new HungryCrabModel({})] }
                    })
                }
            }),
            playerB: new MageModel({
                child: {
                    hand: new HandModel({
                        child: { cards: [
                            new HungryCrabModel({}),
                            new MurlocRaiderCard({})
                        ]}
                    })
                }
            })
        }
    }));
    const handA = game.child.playerA.child.hand;
    const boardA = game.child.playerA.child.board;
    const handB = game.child.playerB.child.hand;
    const boardB = game.child.playerB.child.board;
    const cardA = handA.child.cards.find(item => item instanceof HungryCrabModel);
    const cardB = handB.child.cards.find(item => item instanceof MurlocRaiderCard);
    const cardC = handB.child.cards.find(item => item instanceof HungryCrabModel);
    const cardD = handB.child.cards.find(item => item instanceof MurlocRaiderCard);
    const roleA = cardA?.child.minion;
    const roleB = cardB?.child.minion;
    const roleC = cardC?.child.minion;
    const roleD = cardD?.child.minion;
    if (!roleA || !roleB || !roleC || !roleD) throw new Error();
    const turn = game.child.turn;

    test('hungry-crab-play', async () => {
        let promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeUndefined();
        await promise;

        expect(boardA.child.cards.length).toBe(2);
        expect(roleA.state.attack).toBe(1);
        expect(roleA.child.attack.state.origin).toBe(1);
        expect(roleA.child.attack.state.offset).toBe(0);
        expect(roleA.child.attack.state.current).toBe(1);
        expect(roleA.state.health).toBe(2);

        expect(roleA.child.health.state.limit).toBe(2);
        expect(roleA.child.health.state.origin).toBe(2);
        expect(roleA.child.health.state.offset).toBe(0);
        expect(roleA.child.health.state.damage).toBe(0);
        expect(roleA.child.health.state.memory).toBe(2);
        expect(roleA.child.health.state.current).toBe(2);
    })

    test('hungry-crab-battlecry', async () => {
        expect(boardB.child.cards.length).toBe(0);
        turn.next();
        
        // Play Murloc Raider first
        let promise = cardD.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        expect(boardB.child.cards.length).toBe(1);

        // Play Hungry Crab and trigger battlecry
        promise = cardC.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleD);
        expect(SelectUtil.current?.options.length).toBe(1);
        SelectUtil.set(roleD);
        await promise;


        expect(boardB.child.cards.length).toBe(1);
        expect(roleC.state.attack).toBe(3);
        expect(roleC.child.attack.state.origin).toBe(1);
        expect(roleC.child.attack.state.offset).toBe(2);
        expect(roleC.child.attack.state.current).toBe(3);
        expect(roleC.state.health).toBe(4);


        expect(roleC.child.health.state.limit).toBe(4);
        expect(roleC.child.health.state.origin).toBe(2);
        expect(roleC.child.health.state.offset).toBe(2);
        expect(roleC.child.health.state.damage).toBe(0);
        expect(roleC.child.health.state.memory).toBe(4);
        expect(roleC.child.health.state.current).toBe(4);
    })
})
