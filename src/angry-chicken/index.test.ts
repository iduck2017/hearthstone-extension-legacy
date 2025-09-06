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
    const cardC = boardA.child.minions.find((item: any) => item instanceof AngryChickenModel);
    const cardD = boardB.child.minions.find((item: any) => item instanceof AngryChickenModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    if (!roleC || !roleD) throw new Error();

    test('angry-chicken-attack', async () => {

        expect(roleC.state.attack).toBe(1);
        expect(roleC.state.health).toBe(1);
        expect(roleD.state.attack).toBe(1);
        expect(roleD.state.health).toBe(1);

        const promise = roleC.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(roleD);
        SelectUtil.set(roleD);
        await promise;
        expect(roleC.state.attack).toBe(6);
        expect(roleC.state.health).toBe(0);
        expect(roleC.state.attack).toBe(6);
        expect(roleD.state.health).toBe(0);
        expect(roleC.child.death.state.isActive).toBe(true);
        expect(roleD.child.death.state.isActive).toBe(true);
    })
})
