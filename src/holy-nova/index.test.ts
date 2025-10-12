/**
 * Test cases for Holy Nova
 * 
 * Initial state: Player A has Holy Nova and Water Elemental on board.
 * Player B has Water Elemental on board.
 * 
 * 1. water-element-attack: Player A's Water Elemental attacks Player B's Water Elemental.
 * 2. holy-nova-cast: Player A casts Holy Nova, dealing 2 damage to enemy minions and restoring 2 health to friendly characters.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, AnimeUtil } from "hearthstone-core";
import { HolyNovaModel } from "./index";
import { WaterElementalModel } from "../water-elemental";
import { boot } from "../boot";

describe('holy-nova', () => {
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
                            minions: [],
                            spells: [new HolyNovaModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { minions: [] }
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
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    const cardC = handA.child.spells.find(item => item instanceof HolyNovaModel);
    const cardD = boardA.child.minions.find(item => item instanceof WaterElementalModel);
    const cardE = boardB.child.minions.find(item => item instanceof WaterElementalModel);
    if (!cardC || !cardD || !cardE) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleD = cardD.child.role;
    const roleE = cardE.child.role;

    test('water-element-attack', async () => {
        // Check initial state
        expect(roleD.child.attack.state.current).toBe(3); // Water Elemental: 3/6
        expect(roleD.child.health.state.current).toBe(6);
        expect(roleE.child.attack.state.current).toBe(3); // Enemy Water Elemental: 3/6
        expect(roleE.child.health.state.current).toBe(6);

        // Player A's Water Elemental attacks Player B's Water Elemental
        let promise = roleD.child.action.run();
        await AnimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleE);
        SelectUtil.set(roleE);
        await promise;

        // Both Water Elementals should take 3 damage
        expect(roleD.child.health.state.current).toBe(3); // 6 - 3 = 3
        expect(roleE.child.health.state.current).toBe(3); // 6 - 3 = 3
    });

    test('holy-nova-cast', async () => {
        // Cast Holy Nova
        let promise = cardC.play();
        await promise;

        // Enemy Water Elemental should take 2 damage
        expect(roleE.child.health.state.current).toBe(1); // 3 - 2 = 1

        // Friendly Water Elemental should be healed by 2
        expect(roleD.child.health.state.current).toBe(5); // 3 + 2 = 5

        // Friendly hero should be healed by 2 (if damaged)
        expect(roleA.child.health.state.current).toBe(30); // Should be at full health
    });
});
