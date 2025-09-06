/*
 * Test scenarios for Angry Chicken:
 * 1. angry-chicken-attack: Player A's chicken attacks Player B's chicken, both die and A's chicken gains +5 attack from enrage
 */

import { GameModel, BoardModel, PlayerModel, MageModel, SelectUtil, TimeUtil, ManaModel } from "hearthstone-core";
import { AngryChickenModel } from ".";
import { boot } from "../boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('angry-chicken', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    character: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new AngryChickenModel()] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    character: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new AngryChickenModel()] }
                    }))
                }
            }))
        }
    }));
    const root = boot(game);
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const cardA = boardA.child.minions.find((item: any) => item instanceof AngryChickenModel);
    const cardB = boardB.child.minions.find((item: any) => item instanceof AngryChickenModel);
    const roleA = cardA?.child.role;
    const roleB = cardB?.child.role;
    if (!roleA || !roleB) throw new Error();

    test('angry-chicken-attack', async () => {

        expect(roleA.state.attack).toBe(1);
        expect(roleA.state.health).toBe(1);
        expect(roleB.state.attack).toBe(1);
        expect(roleB.state.health).toBe(1);

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
        expect(roleA.child.death.state.isActive).toBe(true);
        expect(roleB.child.death.state.isActive).toBe(true);
    })
})
