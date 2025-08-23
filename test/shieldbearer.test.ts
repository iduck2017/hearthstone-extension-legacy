import { GameModel, PlayerModel, HandModel, BoardModel, MageModel, TimeUtil, SelectUtil } from "hearthstone-core";
import { WispCardModel } from "../src/wisp";   
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";
import { ShieldbearerCardModel } from "../src";

DebugUtil.level = LogLevel.ERROR;
describe('shieldbearer', () => {
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
                        child: { cards: [
                            new WispCardModel({}),
                            new ShieldbearerCardModel({})
                        ]}
                    })
                }
            })
        }
    })
    boot(game);


    test('attack', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof WispCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof WispCardModel);
        const cardC = boardB.child.cards.find(item => item instanceof ShieldbearerCardModel);
        const roleA = cardA?.child.role;
        const roleB = cardB?.child.role;
        const roleC = cardC?.child.role;
        expect(roleA).toBeDefined();
        expect(roleB).toBeDefined();
        expect(roleC).toBeDefined();
        if (!roleA) return;
        if (!roleB) return;
        if (!roleC) return;
        const turn = game.child.turn;
        expect(turn.refer.current).toBe(game.child.playerA);
        let promise = roleA.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(roleC);
        expect(SelectUtil.current?.options).not.toContain(roleB);
        expect(SelectUtil.current?.options.length).toBe(1);
        SelectUtil.set(roleC);
        await promise;
        expect(roleA.state.health).toBe(1);
        expect(roleC.state.health).toBe(3);
        expect(roleC.child.health.state.limit).toBe(4);
        expect(roleC.child.health.state.damage).toBe(1);
    })
})