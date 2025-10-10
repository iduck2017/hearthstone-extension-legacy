/*
 * Test scenarios for Angry Chicken:
 * 1. angry-chicken-attack: Player A's chicken attacks Player B's chicken, both die and A's chicken gains +5 attack from enrage
 */

import { GameModel, BoardModel, PlayerModel, MageModel, SelectUtil, TimeUtil, ManaModel } from "hearthstone-core";
import { AngryChickenModel } from ".";
import { boot } from "../boot";

describe('angry-chicken', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new AngryChickenModel()] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
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

        expect(roleC.child.attack.state.current).toBe(1);
        expect(roleC.child.health.state.current).toBe(1);
        expect(roleD.child.attack.state.current).toBe(1);
        expect(roleD.child.health.state.current).toBe(1);

        const promise = roleC.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(roleD);
        SelectUtil.set(roleD);
        await promise;
        expect(roleC.child.attack.state.current).toBe(6);
        expect(roleC.child.health.state.current).toBe(0);
        expect(roleC.child.attack.state.current).toBe(6);
        expect(roleD.child.health.state.current).toBe(0);
        expect(cardC.child.dispose.status).toBe(true);
        expect(cardD.child.dispose.status).toBe(true);
    })
})
