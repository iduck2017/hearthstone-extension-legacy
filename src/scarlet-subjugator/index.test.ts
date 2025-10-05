/**
 * Test cases for Scarlet Subjugator
 * 
 * Initial state: Player A has Scarlet Subjugator in hand.
 * Player B has Water Elemental (3/6) on board.
 * 
 * 1. scarlet-subjugator-play: Player A plays Scarlet Subjugator, gives Water Elemental -2 Attack.
 * 2. water-element-attack: Player B uses Water Elemental to attack Player A's hero.
 * 3. turn-start: Player A's turn starts, Water Elemental's debuff expires.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil, WarriorModel } from "hearthstone-core";
import { ScarletSubjugatorModel } from "./index";
import { WaterElementalModel } from "../water-elemental";
import { boot } from "../boot";

describe('scarlet-subjugator', () => {
    const game = new GameModel(() => ({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new WarriorModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [] }
                    })),
                    hand: new HandModel(() => ({
                        child: { 
                            minions: [new ScarletSubjugatorModel()],
                            spells: []
                        }
                    })),
                    deck: new DeckModel(() => ({
                        child: { minions: [] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { 
                            minions: [new WaterElementalModel()]
                        }
                    })),
                    hand: new HandModel(() => ({
                        child: { spells: [] }
                    }))
                }
            }))
        }
    }));
    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    const cardC = handA.child.minions.find(item => item instanceof ScarletSubjugatorModel);
    const cardD = boardB.child.minions.find(item => item instanceof WaterElementalModel);
    if (!cardC || !cardD) throw new Error();
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;

    test('scarlet-subjugator-play', async () => {
        // Check initial state
        expect(cardD.child.role.child.attack.state.current).toBe(3); // Water Elemental: 3/6
        expect(playerA.child.mana.state.current).toBe(10);
        expect(boardA.child.minions.length).toBe(0);
        expect(handA.refer.order.length).toBe(1);

        // Player A plays Scarlet Subjugator
        const promise = cardC.play();
        SelectUtil.set(0);
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(cardD.child.role); // Water Elemental should be targetable
        SelectUtil.set(cardD.child.role);
        await promise;

        // Check that Scarlet Subjugator is on board
        expect(boardA.child.minions.length).toBe(1);

        expect(roleC.child.attack.state.current).toBe(2); // Scarlet Subjugator: 2/1
        expect(roleC.child.health.state.current).toBe(1);

        // Water Elemental should have -2 Attack
        expect(roleD.child.attack.state.current).toBe(1); // 3 - 2 = 1
        expect(roleD.child.health.state.current).toBe(6); // Health unchanged
        // Check that the debuff was applied
        expect(roleD.child.buffs.length).toBe(1); // Should have the -2 Attack debuff

        // Scarlet Subjugator should be consumed
        expect(handA.refer.order.length).toBe(0); // Scarlet Subjugator consumed
        expect(playerA.child.mana.state.current).toBe(9); // 10 - 1 cost
    });

    test('water-element-attack', async () => {
        const turn = game.child.turn;
        turn.next();

        // Water Elemental attacks Player A's hero with reduced attack
        const heroA = playerA.child.hero;
        const roleA = heroA.child.role;
        
        // Check that Water Elemental still has -2 Attack
        expect(roleD.child.attack.state.current).toBe(1); // 3 - 2 = 1
        expect(roleD.child.health.state.current).toBe(6); // Health unchanged
        
        // Water Elemental attacks hero
        const promise = roleD.child.action.run();
        SelectUtil.set(roleA);
        await promise;
        
        // Hero should take 1 damage (reduced attack)
        expect(roleA.child.health.state.current).toBe(29); // 30 - 1 = 29
    });

    test('turn-start', async () => {
        // Player A's turn starts, Water Elemental's debuff should expire
        game.child.turn.next();
        // Water Elemental should regain full attack
        expect(roleD.child.attack.state.current).toBe(3); // Back to original 3 attack
        expect(roleD.child.health.state.current).toBe(6); // Health unchanged
    });
});
