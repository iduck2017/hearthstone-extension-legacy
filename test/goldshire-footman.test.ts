/**
 * Test cases for Goldshire Footman
 * 
 * Requirements:
 * 1. start: Both players have a wisp and footman on board respectively, turn starts
 * 2. attack: Wisp can only attack the footman due to taunt
 */
import { GameModel, PlayerModel, MageModel, BoardModel, TimeUtil, SelectUtil } from "hearthstone-core";
import { GoldshireFootmanModel } from "../src/goldshire-footman";
import { WispCardModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('goldshire-footman', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new WispCardModel({})] }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new GoldshireFootmanModel({})] }
                    })
                }
            })
        }
    })
    boot(game);

    test('attack', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const playerB = game.child.playerB;
        const cardA = boardA.child.cards.find(item => item instanceof WispCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof GoldshireFootmanModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        const heroB = game.child.playerB.child.hero.child.role;
        // Initial state verification
        expect(roleA.state.action).toBe(1); // Wisp has action point
        expect(roleB.child.entries.child.taunt.state.isActive).toBe(true);
        const promise = roleA.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options).not.toContain(heroB);
        SelectUtil.set(roleB);
        await promise;
        expect(roleB.state.health).toBe(1);
        expect(roleB.child.health.state.limit).toBe(2);
        expect(roleB.child.health.state.damage).toBe(1);
        expect(roleB.child.health.state.origin).toBe(2);
        expect(roleB.child.health.state.offset).toBe(0);
    })
}) 