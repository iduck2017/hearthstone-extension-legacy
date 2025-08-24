import { DebugUtil, LogLevel, RouteUtil } from "set-piece";
import { AngryChickenModel } from "../src/angry-chicken";
import { GameModel, PlayerModel, MageModel, BoardModel, SelectUtil, TimeUtil, DeathStatus } from "hearthstone-core";
import { boot } from "./boot";

DebugUtil.level = LogLevel.ERROR;
describe('angry-chicken', () => {
    const game = new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [new AngryChickenModel({})] }
                    })
                }
            }),
            playerB: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [new AngryChickenModel({})] }
                    })
                }
            })
        }
    })
    boot(game);

    test('angry-chicken-initial-stats', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof AngryChickenModel);
        const cardB = boardB.child.cards.find(item => item instanceof AngryChickenModel);
        const roleA = cardA?.child.minion;
        const roleB = cardB?.child.minion;
        expect(roleA).toBeDefined();
        expect(roleB).toBeDefined();
        if (!roleA || !roleB) return;
        expect(roleA.state.attack).toBe(1);
        expect(roleA.state.health).toBe(1);
        expect(roleB.state.attack).toBe(1);
        expect(roleB.state.health).toBe(1);
    })

    test('angry-chicken-attacks-and-gains-buff', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof AngryChickenModel);
        const cardB = boardB.child.cards.find(item => item instanceof AngryChickenModel);
        const roleA = cardA?.child.minion;
        const roleB = cardB?.child.minion;
        expect(roleA).toBeDefined();
        expect(roleB).toBeDefined();
        if (!roleA || !roleB) return;
        const promise = roleA.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(roleB);
        SelectUtil.set(roleB);
        await promise;
        expect(roleA.state.attack).toBe(6);
        expect(roleA.state.health).toBe(0);
        expect(roleA.state.attack).toBe(6);
        expect(roleB.state.health).toBe(0);
        expect(roleA.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(roleB.child.death.state.status).toBe(DeathStatus.ACTIVE);
    })
})
