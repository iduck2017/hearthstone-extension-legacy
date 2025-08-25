import { DebugUtil, LogLevel, RouteUtil } from "set-piece";
import { AngryChickenModel } from "../src/angry-chicken";
import { GameModel, PlayerModel, MageModel, BoardModel, SelectUtil, TimeUtil, DeathStatus, ManaModel } from "hearthstone-core";
import { boot } from "./boot";

DebugUtil.level = LogLevel.ERROR;
describe('angry-chicken', () => {
    const game = new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    board: new BoardModel({
                        child: { cards: [new AngryChickenModel({})] }
                    })
                }
            }),
            playerB: new MageModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    board: new BoardModel({
                        child: { cards: [new AngryChickenModel({})] }
                    })
                }
            })
        }
    })
    boot(game);
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const cardA = boardA.child.cards.find(item => item instanceof AngryChickenModel);
    const cardB = boardB.child.cards.find(item => item instanceof AngryChickenModel);
    const roleA = cardA?.child.minion;
    const roleB = cardB?.child.minion;
    if (!roleA || !roleB) throw new Error();

    test('angry-chicken-initial-state', async () => {
        expect(roleA.state.attack).toBe(1);
        expect(roleA.state.health).toBe(1);
        expect(roleB.state.attack).toBe(1);
        expect(roleB.state.health).toBe(1);
    })

    test('angry-chicken-attack', async () => {
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
