/**
 * Test cases for Bloodfen Raptor
 * 
 * 1. bloodfen-raptor-play: Player plays Bloodfen Raptor
 * 2. bloodfen-raptor-stats: Verify the minion has correct attack and health
 */

import { BoardModel, GameModel, HandModel, MageModel, ManaModel, PlayerModel, TimeUtil, RaceType, ClassType, SelectUtil } from "hearthstone-core";
import { BloodfenRaptorModel } from ".";
import { boot } from "../boot";

describe('bloodfen-raptor', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    hand: new HandModel(() => ({
                        child: { 
                            minions: [
                                new BloodfenRaptorModel()
                            ] 
                        }
                    })),
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                }
            })),
        }
    }));
    boot(game);

    const boardA = game.child.playerA.child.board;
    const handA = game.child.playerA.child.hand;
    const card = handA.child.minions.find((item: any) => item instanceof BloodfenRaptorModel);
    const role = card?.child.role;

    test('bloodfen-raptor-play', async () => {
        expect(boardA.child.minions.length).toBe(0);
        expect(handA.child.minions.length).toBe(1);

        const promise = card?.play();
        await TimeUtil.sleep();
        SelectUtil.set(0);
        await promise;

        expect(boardA.child.minions.length).toBe(1);
        expect(handA.child.minions.length).toBe(0);
    });

    test('bloodfen-raptor-stats', async () => {
        if (!role) throw new Error('Role not found');
        
        // Verify the minion has correct attack and health
        expect(role.child.attack.state.current).toBe(3);
        expect(role.child.attack.state.origin).toBe(3);
        expect(role.child.health.state.current).toBe(2);
        expect(role.child.health.state.origin).toBe(2);
        
        
        // Verify cost
        expect(card?.child.cost.state.current).toBe(2);
        expect(card?.child.cost.state.origin).toBe(2);
    });
});
