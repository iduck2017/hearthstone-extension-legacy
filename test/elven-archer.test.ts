/**
 * Test cases for Elven Archer
 * 
 * Requirements:
 * 1. start: Player B has a wisp on board by default, Player A has an elven archer in hand
 * 2. battlecry: Player A uses Elven Archer to attack the wisp
 */
import { ElvenArcherModel } from "../src/elven-archer";
import { GameModel, PlayerModel, MageModel, HandModel, BoardModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { WispCardModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('elven-archer', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    hand: new HandModel({
                        child: { cards: [new ElvenArcherModel({})] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new WispCardModel({})] }
                    })
                }
            })
        }
    })
    const root = boot(game);

    test('battlecry', async () => {
        const playerA = game.child.playerA;
        const playerB = game.child.playerB;
        const hand = game.child.playerA.child.hand;
        const board = game.child.playerB.child.board;
        const cardA = hand.child.cards.find(item => item instanceof ElvenArcherModel);
        const cardB = board.child.cards.find(item => item instanceof WispCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA) return;
        if (!cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        expect(roleB.state.health).toBe(1);
        const promise = cardA.play();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await TimeUtil.sleep()
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options).toContain(playerA.child.hero.child.role);
        expect(SelectUtil.current?.options).toContain(playerB.child.hero.child.role);
        SelectUtil.set(roleB);
        await promise;
        expect(roleB.state.health).toBe(0);
        expect(roleB.child.health.state.damage).toBe(1);
        expect(roleB.child.health.state.limit).toBe(1);
        expect(roleB.child.health.state.current).toBe(0);
        expect(roleB.child.health.state.origin).toBe(1);
        expect(roleB.child.death.state.isActive).toBe(true);
        const reason = roleB.child.death.refer.reason;
        expect(reason?.route.card).toBe(cardA);
    })
})
