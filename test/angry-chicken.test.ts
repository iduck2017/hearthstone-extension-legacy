import { DebugUtil, LogLevel, RouteUtil } from "set-piece";
import { AngryChickenModel } from "../src/angry-chicken";
import { GameModel, PlayerModel, MageModel, BoardModel, SelectUtil } from "hearthstone-core";
import { boot } from "./boot";

DebugUtil.level = LogLevel.ERROR;
describe('angry-chicken', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new AngryChickenModel({})] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new AngryChickenModel({})] }
                    })
                }
            })
        }
    })
    boot(game);

    test('init', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof AngryChickenModel);
        const cardB = boardB.child.cards.find(item => item instanceof AngryChickenModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA) return;
        if (!cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        expect(roleA.state.attack).toBe(1);
        expect(roleA.state.health).toBe(1);
        expect(roleB.state.attack).toBe(1);
        expect(roleB.state.health).toBe(1);
    })

    test('buff', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof AngryChickenModel);
        const cardB = boardB.child.cards.find(item => item instanceof AngryChickenModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA) return;
        if (!cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        const promise = roleA.child.attack.run();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(roleB);
        SelectUtil.set(roleB);
        await promise;
        expect(roleA.state.attack).toBe(6);
        expect(roleA.state.health).toBe(0);
        expect(roleA.state.attack).toBe(6);
        expect(roleB.state.health).toBe(0);
        expect(roleA.child.death.state.isActive).toBe(true);
        expect(roleB.child.death.state.isActive).toBe(true);
    })
})
