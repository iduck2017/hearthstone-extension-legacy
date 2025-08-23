import { GameModel, HandModel, MageModel, PlayerModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { boot } from "./boot";
import { AbusiveSergeantModel } from "../src/abusive-sergeant";
import { WispCardModel } from "../src/wisp";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR
describe('abusive-sergeant', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    hand: new HandModel({
                        child: { cards: [
                            new AbusiveSergeantModel({}),
                            new WispCardModel({})
                        ]}
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    hand: new HandModel({
                        child: { cards: [
                            new AbusiveSergeantModel({}),
                            new WispCardModel({})
                        ]}
                    })
                }
            })
        }
    }));

    test('skip', async () => {
        const handA = game.child.playerA.child.hand;
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = handA.child.cards.find(item => item instanceof AbusiveSergeantModel);
        const cardB = handA.child.cards.find(item => item instanceof WispCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        // Player B has no minions on board, so Abusive Sergeant cannot trigger battlecry
        expect(boardB.child.cards.length).toBe(0);
        expect(boardA.child.cards.length).toBe(0);
        let promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeUndefined();
        // Play both cards without battlecry effect
        expect(boardA.child.cards.length).toBe(1);
        promise = cardB.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(1);
        SelectUtil.set(1);
        await promise;
        expect(boardA.child.cards.length).toBe(2);
        expect(roleA.state.attack).toBe(2);
        expect(roleA.child.attack.state.offset).toBe(0);
        expect(roleA.child.attack.state.origin).toBe(2);
        expect(roleB.state.attack).toBe(1);
        expect(roleB.child.attack.state.offset).toBe(0);
        expect(roleB.child.attack.state.origin).toBe(1);
    })

    test('buff', async () => {
        const handB = game.child.playerB.child.hand;
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = handB.child.cards.find(item => item instanceof AbusiveSergeantModel);
        const cardB = handB.child.cards.find(item => item instanceof WispCardModel);
        const cardC = boardA.child.cards.find(item => item instanceof WispCardModel);
        const cardD = boardA.child.cards.find(item => item instanceof AbusiveSergeantModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        const roleC = cardC?.child.role;
        const roleD = cardD?.child.role;
        let promise = cardB.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        expect(boardB.child.cards.length).toBe(1);
        game.child.turn.next();
        promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(0);
        expect(SelectUtil.current?.options.length).toBe(2);
        SelectUtil.set(0);
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options).toContain(roleC);
        expect(SelectUtil.current?.options).toContain(roleD);
        expect(SelectUtil.current?.options.length).toBe(3);
        SelectUtil.set(roleB);
        await promise;
        await TimeUtil.sleep();
        expect(boardA.child.cards.length).toBe(2);
        expect(boardB.child.cards.length).toBe(2);
        expect(roleA.state.attack).toBe(2);
        expect(roleB.state.attack).toBe(3);
        expect(roleB.child.attack.state.offset).toBe(2);
        expect(roleB.child.attack.state.origin).toBe(1);
        expect(roleC?.state.attack).toBe(1);
        expect(roleD?.state.attack).toBe(2);
    })

    test('turn-end', async () => {
        const boardB = game.child.playerB.child.board;
        const cardB = boardB.child.cards.find(item => item instanceof WispCardModel);
        const roleB = cardB?.child.role;
        expect(roleB).toBeDefined();
        if (!roleB) return;
        expect(roleB.state.attack).toBe(3);
        game.child.turn.next();
        expect(roleB.state.attack).toBe(1);
        expect(roleB.child.attack.state.offset).toBe(0);
        expect(roleB.child.attack.state.origin).toBe(1);
    })
})
