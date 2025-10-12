/**
 * Test cases for Circle of Healing
 * 
 * Initial state: Player A has Water Elemental on board, Circle of Healing and Frostbolt in hand. Player B has Water Elemental on board.
 * 
 * 1. water-elemental-attack: Player A's Water Elemental attacks Player B's Water Elemental
 * 2. frostbolt-cast: Player A uses Frostbolt on Player B's hero
 * 3. circle-of-healing-cast: Player A plays Circle of Healing, heals all minions but not heroes
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, AnimeUtil, SelectUtil } from "hearthstone-core";
import { CircleOfHealingModel } from "./index";
import { FrostboltModel } from "../frostbolt";
import { WaterElementalModel } from "../water-elemental";
import { boot } from "../boot";

describe('circle-of-healing', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            minions: [new WaterElementalModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            spells: [new CircleOfHealingModel(), new FrostboltModel()]
                        }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            minions: [new WaterElementalModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { spells: [] }
                    })
                }
            })
        }
    });
    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const handA = playerA.child.hand;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const cardC = boardA.child.minions.find(item => item instanceof WaterElementalModel);
    const cardD = boardB.child.minions.find(item => item instanceof WaterElementalModel);
    const cardE = handA.child.spells.find(item => item instanceof FrostboltModel);
    const cardF = handA.child.spells.find(item => item instanceof CircleOfHealingModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    const roleB = playerB.child.hero.child.role;
    if (!cardC || !cardD || !cardE || !cardF || !roleC || !roleD) throw new Error();

    test('water-elemental-attack', async () => {
        // Check initial stats
        expect(roleC.child.health.state.current).toBe(6); // Player A's Water Elemental: 3/6
        expect(roleD.child.health.state.current).toBe(6); // Player B's Water Elemental: 3/6
        expect(roleB.child.health.state.current).toBe(30); // Player B hero: 30 health

        // Player A's Water Elemental attacks Player B's Water Elemental
        const promise = roleC.child.action.run();
        await AnimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleD);
        SelectUtil.set(roleD);
        await promise;

        // Both Water Elementals should take 3 damage
        expect(roleC.child.health.state.current).toBe(3); // Player A's Water Elemental: 6 - 3 = 3
        expect(roleD.child.health.state.current).toBe(3); // Player B's Water Elemental: 6 - 3 = 3
        expect(roleB.child.health.state.current).toBe(30); // Hero should not be affected
    });

    test('frostbolt-cast', async () => {
        // Check current stats
        expect(roleB.child.health.state.current).toBe(30); // Player B hero: 30 health
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.spells.length).toBe(2);

        // Player A uses Frostbolt on Player B's hero
        const promise = cardE.play();
        expect(SelectUtil.current?.options).toContain(roleB);
        SelectUtil.set(roleB);
        await promise;

        // Player B's hero should take 3 damage
        expect(roleB.child.health.state.current).toBe(27); // 30 - 3 = 27
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 cost
        expect(handA.child.spells.length).toBe(1); // Frostbolt consumed
    });

    test('circle-of-healing-cast', async () => {
        // Check current stats before healing
        expect(roleC.child.health.state.current).toBe(3); // Player A's Water Elemental: 3/6, damaged
        expect(roleD.child.health.state.current).toBe(3); // Player B's Water Elemental: 3/6, damaged
        expect(roleB.child.health.state.current).toBe(27); // Player B hero: 27 health, damaged
        expect(playerA.child.mana.state.current).toBe(8);
        expect(handA.child.spells.length).toBe(1);

        // Player A plays Circle of Healing - no target selection needed
        await cardF.play();

        // Only minions should be healed, not heroes
        expect(roleC.child.health.state.current).toBe(6); // Player A's Water Elemental: 3 + 4 = 6 (full health)
        expect(roleD.child.health.state.current).toBe(6); // Player B's Water Elemental: 3 + 4 = 6 (full health)
        expect(roleB.child.health.state.current).toBe(27); // Player B hero: 27 health (unchanged - heroes not affected)

        expect(playerA.child.mana.state.current).toBe(8); // 8 - 0 cost
        expect(handA.child.spells.length).toBe(0); // Circle of Healing consumed
    });
});
