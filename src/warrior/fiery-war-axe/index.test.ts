/**
 * Test cases for Fiery War Axe
 * 
 * - initial-state:
 *   - Player A has Fiery War Axe in hand
 *   - Player A hero attack 0
 *   - Player B has Wisp (1/1) on board
 * - fiery-war-axe-equip:
 *   - Player A equips Fiery War Axe
 *   - Assert: Player A's hand size is 0
 *   - Assert: Hero attack becomes 3
 *   - Assert: Weapon attack is 3
 *   - Assert: Weapon durability is 2
 * - warrior-attack:
 *   - Player A attacks Player B's Wisp with weapon
 *   - Assert: Wisp is destroyed
 *   - Assert: Hero takes damage
 *   - Assert: Weapon durability decreases
 * - fiery-war-axe-deactive:
 *   - Turn switches to Player B
 *   - Assert: Weapon is not ready when not Player A's turn
 *   - Assert: Hero attack becomes 0 when not Player A's turn
 * - warrior-attack:
 *   - Turn switches back to Player A
 *   - Player A attacks Player B's hero with weapon
 *   - Assert: Player B's hero takes damage
 *   - Assert: Weapon is destroyed
 *   - Assert: Hero attack becomes 0
 */
import { BoardModel, GameModel, HandModel, MageModel, ManaModel, PlayerModel, WarriorModel } from "hearthstone-core";
import { WispModel } from "../../neutral/wisp";
import { FieryWarAxeModel } from ".";
import { DebugService } from "set-piece";
import { boot } from "../../boot";

describe('firey-war-axe', () => {
    const game = boot(new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new WarriorModel(),
                    hand: new HandModel({
                        child: { cards: [new FieryWarAxeModel()] }
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
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const cardC = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC) throw new Error();
    const turn = game.child.turn;

    const weapon = handA.child.cards.find(item => item instanceof FieryWarAxeModel);
    expect(weapon).toBeDefined();
    if (!weapon) throw new Error();

    // initial-state:
    // - Player A has Fiery War Axe in hand
    // - Player A hero attack 0
    // - Player B has Wisp (1/1) on board

    test('fiery-war-axe-equip', async () => {
        // Check initial state before equipping
        // Assert: Hero attack is 0
        expect(heroA.child.attack.state.current).toBe(0);
        // Assert: Hand has 1 card
        expect(handA.child.cards.length).toBe(1);
        // Assert: Hero has no weapon equipped
        expect(heroA.child.weapon).toBeUndefined();
        
        // Player A equips Fiery War Axe
        await weapon.play();

        // Assert: Hand is empty after playing weapon
        expect(handA.child.cards.length).toBe(0);
        // Assert: Hero has weapon equipped
        expect(heroA.child.weapon).toBeDefined();
        // Assert: Hero attack becomes 3
        expect(heroA.child.attack.state.current).toBe(3);
        // Assert: Weapon attack is 3
        expect(weapon?.child.attack.state.current).toBe(3);
        // Assert: Hero attack is still 3
        expect(heroA.child.attack.state.current).toBe(3);
    })


    test('warrior-attack', async () => {
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
        // Assert: Wisp health is -2 (overkilled)
        expect(cardC.child.health.state.current).toBe(-2);
        // Assert: Wisp took 3 damage
        expect(cardC.child.health.state.damage).toBe(3);

        // Assert: Hero health is 29 (took 1 damage from Wisp)
        expect(heroA.child.health.state.current).toBe(29);
        // Assert: Hero took 1 damage
        expect(heroA.child.health.state.damage).toBe(1);

        // Assert: Weapon durability is 1 (decreased from 2)
        expect(weapon.child.action.state.current).toBe(1);
        // Assert: Weapon durability consumed is 1
        expect(weapon.child.action.state.consume).toBe(1);
        // Assert: Weapon original durability is 2
        expect(weapon.child.action.state.origin).toBe(2);

        // Assert: Player B's board is empty
        expect(boardB.child.cards.length).toBe(0);
    })

    test('fiery-war-axe-deactive', () => {
        // Check weapon is ready before turn switch
        // Assert: Weapon is ready
        expect(weapon.child.attack.state.isReady).toBe(true);
        // Assert: Hero attack is 3
        expect(heroA.child.attack.state.current).toBe(3);
        
        // Turn switches to Player B
        turn.next();
        // Assert: Current turn is Player B
        expect(turn.refer.current).toBe(playerB);
        
        // Assert: Weapon is not ready when not Player A's turn
        expect(weapon.child.attack.state.isReady).toBe(false);
        // Assert: Hero attack becomes 0 when not Player A's turn
        expect(heroA.child.attack.state.current).toBe(0);
    }) 

    test('warrior-attack', async () => {
        // Turn switches back to Player A
        turn.next();
        // Assert: Weapon is ready again
        expect(weapon.child.attack.state.isReady).toBe(true);
        // Assert: Hero action is ready
        expect(heroA.child.action.state.isReady).toBe(true);

        // Player A attacks Player B's hero with weapon
        const promise = heroA.child.action.run();
        // Assert: Controller selector is available
        expect(playerA.controller.current).toBeDefined();
        // Assert: Can target Player B's hero
        expect(playerA.controller.current?.options).toContain(heroB);
        playerA.controller.set(heroB);
        await promise;

        // Assert: Player B's hero health is 27 (took 3 damage)
        expect(heroB.child.health.state.current).toBe(27);
        // Assert: Player B's hero took 3 damage
        expect(heroB.child.health.state.damage).toBe(3);

        // Assert: Weapon is destroyed
        expect(weapon.child.dispose.state.isActived).toBe(true);
        // Assert: Weapon durability is 0
        expect(weapon.child.action.state.current).toBe(0);
        // Assert: Hero has no weapon equipped
        expect(heroA.child.weapon).toBeUndefined();
        
        // Assert: Hero attack becomes 0
        expect(heroA.child.attack.state.current).toBe(0);
    })
})