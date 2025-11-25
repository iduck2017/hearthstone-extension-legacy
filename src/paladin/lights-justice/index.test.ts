/**
 * Test cases for Light's Justice
 * 
 * 1. initial-state:
 *    - Player A has Light's Justice in hand
 *    - Player A hero attack 0
 *    - Player B has Wisp (1/1) on board
 * 2. lights-justice-equip:
 *    - Player A equips Light's Justice
 *    - Assert: Player A's hand size is 0
 *    - Assert: Hero attack becomes 1
 *    - Assert: Weapon attack is 1
 *    - Assert: Weapon durability is 4
 * 3. paladin-attack:
 *    - Player A attacks Player B's Wisp with weapon
 *    - Assert: Wisp is destroyed
 *    - Assert: Hero takes damage
 *    - Assert: Weapon durability decreases
 */

import { BoardModel, GameModel, HandModel, MageModel, ManaModel, PlayerModel } from "hearthstone-core";
import { WispModel } from "../../neutral/wisp";
import { LightsJusticeModel } from ".";
import { boot } from "../../boot";

describe('lights-justice', () => {
    const game = boot(new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    hand: new HandModel({
                        child: { cards: [new LightsJusticeModel()] }
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
    const heroB = playerB.child.hero;
    const handA = playerA.child.hand;
    const boardB = playerB.child.board;
    const cardC = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC) throw new Error();

    const weapon = handA.child.cards.find(item => item instanceof LightsJusticeModel);
    expect(weapon).toBeDefined();
    if (!weapon) throw new Error();

    test('lights-justice-equip', async () => {
        // Check initial state before equipping
        // Assert: Hero attack is 0
        expect(heroA.child.attack.state.current).toBe(0);
        // Assert: Hand has 1 card
        expect(handA.child.cards.length).toBe(1);
        // Assert: Hero has no weapon equipped
        expect(heroA.child.weapon).toBeUndefined();
        
        // Player A equips Light's Justice
        await weapon.play();

        // Assert: Hand is empty after playing weapon
        expect(handA.child.cards.length).toBe(0);
        // Assert: Hero has weapon equipped
        expect(heroA.child.weapon).toBeDefined();
        // Assert: Hero attack becomes 1
        expect(heroA.child.attack.state.current).toBe(1);
        // Assert: Weapon attack is 1
        expect(weapon?.child.attack.state.current).toBe(1);
        // Assert: Weapon durability is 4
        expect(weapon?.child.action.state.current).toBe(4);
    });

    test('paladin-attack', async () => {
        // Player A attacks Player B's Wisp with weapon
        const promise = heroA.child.action.run();
        // Assert: Controller selector is available
        expect(playerA.controller.current).toBeDefined();
        // Assert: Can target Wisp
        expect(playerA.controller.current?.options).toContain(cardC);
        // Assert: Can target Player B's hero
        expect(playerA.controller.current?.options).toContain(heroB);
        playerA.controller.set(cardC);
        await promise;

        // Assert: Wisp is destroyed
        expect(cardC.child.dispose.state.isActived).toBe(true);
        // Assert: Wisp health is 0 (1 - 1)
        expect(cardC.child.health.state.current).toBe(0);

        // Assert: Hero health is 29 (took 1 damage from Wisp)
        expect(heroA.child.health.state.current).toBe(29);
        // Assert: Hero took 1 damage
        expect(heroA.child.health.state.damage).toBe(1);

        // Assert: Weapon durability is 3 (decreased from 4)
        expect(weapon.child.action.state.current).toBe(3);
        // Assert: Weapon durability consumed is 1
        expect(weapon.child.action.state.consume).toBe(1);
        // Assert: Weapon original durability is 4
        expect(weapon.child.action.state.origin).toBe(4);

        // Assert: Player B's board is empty
        expect(boardB.child.cards.length).toBe(0);
    });
});

