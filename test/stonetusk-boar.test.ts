// Test scenario:
// Initial setup: Player A has Stonetusk Boar in hand, Player B has Wisp on board
// Test case: Player A plays Stonetusk Boar, boar directly attacks Player B's hero

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil } from "hearthstone-core";
import { StonetuskBoarModel } from "../src/stonetusk-boar";
import { WispModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('stonetusk-boar', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { cards: [new StonetuskBoarModel({})] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new WispModel({})] }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
                    })
                }
            })
        }
    }));

    test('charge', async () => {
        const handA = game.child.playerA.child.hand;
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = handA.child.cards.find(item => item instanceof StonetuskBoarModel);
        expect(cardA).toBeDefined();
        if (!cardA) return;
        const roleA = cardA.child.role;
        const heroB = game.child.playerB.child.hero.child.role;
        
        expect(boardA.child.cards.length).toBe(0);
        expect(boardB.child.cards.length).toBe(1);
        expect(heroB.state.health).toBe(30);
        
        // Play Stonetusk Boar
        let promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        expect(boardA.child.cards.length).toBe(1);
        expect(roleA.state.attack).toBe(1);
        expect(roleA.state.health).toBe(1);
        expect(roleA.state.action).toBe(1);
        expect(roleA.child.action.check()).toBe(true);
        
        // Boar directly attacks enemy hero
        promise = roleA.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(heroB);
        expect(SelectUtil.current?.options.length).toBe(2);
        SelectUtil.set(heroB);
        await promise;
        
        expect(roleA.state.action).toBe(0);
        expect(heroB.state.health).toBe(29);
        expect(heroB.child.health.state.damage).toBe(1);
    })
}) 