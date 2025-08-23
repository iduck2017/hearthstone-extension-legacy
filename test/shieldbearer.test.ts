import { GameModel, PlayerModel, HandModel, BoardModel, MageModel, TimeUtil, SelectUtil } from "hearthstone-core";
import { WispModel } from "../src/wisp";   
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";
import { ShieldbearerModel } from "../src/shieldbearer";

DebugUtil.level = LogLevel.ERROR;
describe('shieldbearer', () => {
    const game = new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [new WispModel({})] }
                    }),
                }
            }),
            playerB: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [
                            new WispModel({}),
                            new ShieldbearerModel({})
                        ]}
                    })
                }
            })
        }
    })
    boot(game);


    test('wisp-attacks-shieldbearer', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof WispModel);
        const cardB = boardB.child.cards.find(item => item instanceof WispModel);
        const cardC = boardB.child.cards.find(item => item instanceof ShieldbearerModel);
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

    test('shieldbearer-cannot-attack', async () => {
        const turn = game.child.turn;
        turn.next();
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const card = boardB.child.cards.find(item => item instanceof ShieldbearerModel);
        expect(card).toBeDefined();
        if (!card) return;
        const role = card.child.role;
        const promise = role.child.action.run();
        expect(role.state.attack).toBe(0);
        expect(role.state.action).toBe(1);
        expect(role.child.sleep.state.status).toBe(false);
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeUndefined();
        await promise;
    })
})