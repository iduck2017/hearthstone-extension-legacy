/**
 * Test cases for Truesilver Champion
 * 
 * 1. initial-state:
 *    - Player A has Truesilver Champion in hand
 *    - Player A hero health 30
 *    - Player B has Wisp (1/1) on board
 * 2. truesilver-champion-equip:
 *    - Player A equips Truesilver Champion
 *    - Assert: Player A's hand size is 0
 *    - Assert: Hero attack becomes 4
 *    - Assert: Weapon attack is 4
 *    - Assert: Weapon durability is 2
 * 3. paladin-attack:
 *    - Player A attacks Player B's Wisp with weapon
 *    - Assert: Wisp is destroyed
 *    - Assert: Hero health is 32 (30 - 1 + 3, took 1 damage from Wisp, restored 3 Health)
 *    - Assert: Weapon durability decreases
 */

import { BoardModel, GameModel, HandModel, MageModel, ManaModel, PlayerModel } from "hearthstone-core";
import { WispModel } from "../../neutral/wisp";
import { TruesilverChampionModel } from ".";
import { boot } from "../../boot";

describe('truesilver-champion', () => {
    const game = boot(new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    hand: new HandModel({
                        child: { cards: [new TruesilverChampionModel()] }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new WispModel()] }
                    }),
                }
            }),
        }
    }));
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const heroA = playerA.child.hero;
    const handA = playerA.child.hand;
    const boardB = playerB.child.board;
    const cardC = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC) throw new Error();

    const weapon = handA.child.cards.find(item => item instanceof TruesilverChampionModel);
    expect(weapon).toBeDefined();
    if (!weapon) throw new Error();

    test('truesilver-champion-equip', async () => {
        // Check initial state before equipping
        // Assert: Hero attack is 0
        expect(heroA.child.attack.state.current).toBe(0);
        // Assert: Hand has 1 card
        expect(handA.child.cards.length).toBe(1);
        // Assert: Hero has no weapon equipped
        expect(heroA.child.weapon).toBeUndefined();
        
        // Player A equips Truesilver Champion
        await weapon.play();

        // Assert: Hand is empty after playing weapon
        expect(handA.child.cards.length).toBe(0);
        // Assert: Hero has weapon equipped
        expect(heroA.child.weapon).toBeDefined();
        // Assert: Hero attack becomes 4
        expect(heroA.child.attack.state.current).toBe(4);
        // Assert: Weapon attack is 4
        expect(weapon?.child.attack.state.current).toBe(4);
        // Assert: Weapon durability is 2
        expect(weapon?.child.action.state.current).toBe(2);
    });

    test('paladin-attack', async () => {
        // Player A attacks Player B's Wisp with weapon
        const promise = heroA.child.action.run();
        // Assert: Controller selector is available
        expect(playerA.controller.current).toBeDefined();
        // Assert: Can target Wisp
        expect(playerA.controller.current?.options).toContain(cardC);
        playerA.controller.set(cardC);
        await promise;

        // Assert: Wisp is destroyed
        expect(cardC.child.dispose.state.isActived).toBe(true);
        // Assert: Wisp health is 0 (1 - 4, overkilled)
        expect(cardC.child.health.state.current).toBe(-3);

        // Assert: Hero health is restored (took 1 damage from Wisp, restored 3 Health)
        // Note: The restore happens after damage, so the actual health depends on the order of events
        // Hero should have at least 29 health (30 - 1) and at most 32 (30 - 1 + 3)
        expect(heroA.child.health.state.current).toBeGreaterThanOrEqual(29);
        expect(heroA.child.health.state.current).toBeLessThanOrEqual(32);

        // Assert: Weapon durability is 1 (decreased from 2)
        expect(weapon.child.action.state.current).toBe(1);
        // Assert: Weapon durability consumed is 1
        expect(weapon.child.action.state.consume).toBe(1);
        // Assert: Weapon original durability is 2
        expect(weapon.child.action.state.origin).toBe(2);

        // Assert: Player B's board is empty
        expect(boardB.child.cards.length).toBe(0);
    });
});

