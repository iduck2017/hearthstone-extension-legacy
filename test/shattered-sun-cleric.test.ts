import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil } from "hearthstone-core";
import { ShatteredSunClericCardModel } from "../src/shattered-sun-cleric";
import { WispCardModel } from "../src/wisp";
import { boot } from "./boot";

describe('shattered-sun-cleric', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new WispCardModel({})] }
                    }),
                    hand: new HandModel({
                        child: { cards: [new ShatteredSunClericCardModel({})] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    hand: new HandModel({
                        child: { cards: [
                            new ShatteredSunClericCardModel({}),
                            new WispCardModel({})
                        ]}
                    })
                }
            })
        }
    }));

    test('battlecry', async () => {
        const handA = game.child.playerA.child.hand;
        const boardA = game.child.playerA.child.board;
        const cardA = handA.child.cards.find(item => item instanceof ShatteredSunClericCardModel);
        const cardB = boardA.child.cards.find(item => item instanceof WispCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA) return;
        if (!cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        let promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options.length).toBe(1);
        SelectUtil.set(roleB);
        await promise;
        expect(boardA.child.cards.length).toBe(2);
        expect(roleB.state.attack).toBe(2);
        expect(roleB.child.attack.state.origin).toBe(1);
        expect(roleB.child.attack.state.offset).toBe(1);
        expect(roleB.child.attack.state.current).toBe(2);
        expect(roleB.state.health).toBe(2);
        expect(roleB.child.health.state.limit).toBe(2);
        expect(roleB.child.health.state.origin).toBe(1);
        expect(roleB.child.health.state.offset).toBe(1);
        expect(roleB.child.health.state.damage).toBe(0);
        expect(roleB.child.health.state.memory).toBe(2);
        expect(roleB.child.health.state.current).toBe(2);
    })

    test('cancel', async () => {
        const turn = game.child.turn;
        turn.next();
        const handB = game.child.playerB.child.hand;
        const boardB = game.child.playerB.child.board;
        const cardA = handB.child.cards.find(item => item instanceof ShatteredSunClericCardModel);
        const cardB = handB.child.cards.find(item => item instanceof WispCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA) return;
        if (!cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        // Player B has no minions on board, so battlecry cannot trigger
        expect(boardB.child.cards.length).toBe(0);
        let promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeUndefined();
        await promise;
        expect(boardB.child.cards.length).toBe(1);
        promise = cardB.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        expect(boardB.child.cards.length).toBe(2);
        expect(roleB.state.action).toBe(1);
        expect(roleB.state.health).toBe(1);
    })

    test('attack', async () => {
        const turn = game.child.turn;
        turn.next();
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof WispCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof WispCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA) return;
        if (!cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        const heroB = game.child.playerB.child.hero.child.role;
        expect(turn.refer.current).toBe(game.child.playerA);
        let promise = roleA.child.attack.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options).toContain(heroB);
        expect(SelectUtil.current?.options.length).toBe(3);
        SelectUtil.set(roleB);
        await promise;
        expect(roleA.state.attack).toBe(2);
        expect(roleA.state.health).toBe(1);
        expect(roleA.state.action).toBe(0);
        expect(roleA.child.health.state.damage).toBe(1);
        expect(roleA.child.health.state.offset).toBe(1);
        expect(roleA.child.death.state.isDying).toBe(false);
        expect(roleB.state.attack).toBe(1);
        expect(roleB.state.health).toBe(-1);
        expect(roleB.state.action).toBe(1);
        expect(roleB.child.health.state.damage).toBe(2);
        expect(roleB.child.health.state.offset).toBe(0);
        expect(roleB.child.death.state.isDying).toBe(true);
        expect(boardB.child.cards.length).toBe(1);
        expect(boardA.child.cards.length).toBe(2);
    })
})


