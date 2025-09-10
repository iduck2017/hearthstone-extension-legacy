/*
 * Test scenarios for Bloodsail Corsair:
 * 1. bloodsail-corsair-battlecry: Player A plays Bloodsail Corsair, removes 1 durability from Player B's weapon
 */

import { GameModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil, ManaModel, DurabilityModel, WeaponAttackModel, WeaponCardModel, WarriorModel } from "hearthstone-core";
import { BloodsailCorsairModel } from ".";
import { boot } from "../boot";
import { FieryWarAxeModel } from "../fiery-war-axe";

describe('bloodsail-corsair', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    hand: new HandModel(() => ({
                        child: { minions: [new BloodsailCorsairModel()] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new WarriorModel(() => ({
                        child: { weapon: new FieryWarAxeModel() }
                    })),
                }
            }))
        }
    }));
    boot(game);
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const handA = playerA.child.hand;
    const cardC = handA.child.minions.find((item: any) => item instanceof BloodsailCorsairModel);
    const roleC = cardC?.child.role;
    const heroB = playerB.child.hero;
    const weaponB = heroB.child.weapon;
    if (!roleC || !weaponB) throw new Error();

    test('bloodsail-corsair-battlecry', async () => {
        // Verify initial weapon durability
        expect(weaponB.child.durability.state.current).toBe(2);
        expect(weaponB.child.durability.state.reduce).toBe(0);
        
        // Player A plays Bloodsail Corsair
        let promise = cardC.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        
        // Verify minion is played
        expect(roleC.child.attack.state.current).toBe(1);
        expect(roleC.child.health.state.current).toBe(2);
        
        // Verify weapon durability is reduced by 1
        expect(weaponB.child.durability.state.current).toBe(1);
        expect(weaponB.child.durability.state.reduce).toBe(1);
    });
}); 