import { GameModel, PlayerModel, HandModel, BoardModel, MageModel, TimeUtil, SelectUtil, DeathStatus } from "hearthstone-core";
import { WispModel } from "../src/wisp";   
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('wisp', () => {
    const game = new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    hand: new HandModel({
                        child: { cards: [new WispModel({})] }
                    }),
                }
            }),
            playerB: new MageModel({
                child: {
                    board: new BoardModel({
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
    const cardA = handA.child.cards.find(item => item instanceof WispModel);
    const cardB = boardB.child.cards.find(item => item instanceof WispModel);
    const roleA = cardA?.child.minion;
    const roleB = cardB?.child.minion;
    if (!roleA || !roleB) throw new Error();

    test('role-summon', async () => {
        expect(handA.child.cards.length).toBe(1);
        expect(handB.child.cards.length).toBe(0);
        expect(boardA.child.cards.length).toBe(0);
        expect(boardB.child.cards.length).toBe(1);
        const promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options.length).toBe(1);
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        expect(boardA.child.cards.length).toBe(1);
        expect(boardB.child.cards.length).toBe(1);
        expect(handA.child.cards.length).toBe(0);
        expect(handB.child.cards.length).toBe(0);
    })

    test('role-attack', async () => {
        game.child.turn.next();
        expect(roleB.state.action).toBe(1);
        const promise = roleB.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(roleA);
        expect(SelectUtil.current?.options.length).toBe(2);
        SelectUtil.set(roleA);
        await promise;
        expect(roleB.state.action).toBe(0)
        expect(roleA.state.health).toBe(0);
        expect(roleA.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(roleB.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(boardA.child.cards.length).toBe(0);
        expect(boardB.child.cards.length).toBe(0);
    })
})