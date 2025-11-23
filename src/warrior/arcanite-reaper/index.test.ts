/**
 * Test cases for Arcanite Reaper
 * 
 * - initial-state:
 *   - Player A has Arcanite Reaper in hand
 *   - Player A hero attack 0
 *   - Player B has Wisp (1/1) on board
 * - arcanite-reaper-equip:
 *   - Player A equips Arcanite Reaper
 *   - Assert: Player A's hand size is 0
 *   - Assert: Hero attack becomes 5
 *   - Assert: Weapon durability is 2
 * - arcanite-reaper-attack:
 *   - Player A attacks Player B's Wisp with weapon
 *   - Assert: Wisp is destroyed
 *   - Assert: Weapon durability becomes 1
 * - turn-next:
 *   - Turn switches to Player B, then back to Player A
 *   - Assert: Hero attack becomes 0 when not Player A's turn
 * - arcanite-reaper-break:
 *   - Player A attacks Player B's hero with weapon
 *   - Assert: Player B's hero health is 25
 *   - Assert: Weapon is destroyed
 *   - Assert: Hero attack becomes 0
 */
import { BoardModel, GameModel, HandModel, MageModel, ManaModel, PlayerModel, WarriorModel, CommonUtil } from "hearthstone-core";
import { WispModel } from "../../neutral/wisp";
import { ArcaniteReaperModel } from ".";
import { boot } from "../../boot";

describe('arcanite-reaper', () => {
    const game = boot(new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new WarriorModel(),
                    hand: new HandModel({
                        child: { cards: [new ArcaniteReaperModel()] }
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
    const turn = game.child.turn;

    const weapon = handA.child.cards.find(item => item instanceof ArcaniteReaperModel);
    expect(weapon).toBeDefined();
    if (!weapon) throw new Error();

    // initial-state:
    // - Player A has Arcanite Reaper in hand
    // - Player A hero attack 0
    // - Player B has Wisp (1/1) on board

    test('arcanite-reaper-equip', async () => {
        // Player A equips Arcanite Reaper
        await weapon.play();

        // Assert: Hand is empty after playing weapon
        expect(handA.child.cards.length).toBe(0);
        // Assert: Hero attack becomes 5
        expect(heroA.child.attack.state.current).toBe(5);
        // Assert: Weapon durability is 2
        expect(weapon?.child.action.state.current).toBe(2);
    })

    test('arcanite-reaper-attack', async () => {
        // Player A attacks Player B's Wisp with weapon
        const promise = heroA.child.action.run();
        await CommonUtil.sleep();
        const selector = playerA.controller.current;
        // Assert: Controller selector is available
        expect(selector).toBeDefined();
        if (!selector) return;
        playerA.controller.set(cardC);
        await promise;

        // Assert: Wisp is destroyed
        expect(cardC.child.dispose.state.isActived).toBe(true);
        // Assert: Weapon durability becomes 1
        expect(weapon?.child.action.state.current).toBe(1);
    })

    test('turn-next', () => {
        // Turn switches to Player B, then back to Player A
        turn.next();
        // Assert: Current turn is Player B
        expect(turn.refer.current).toBe(playerB);
        // Assert: Hero attack becomes 0 when not Player A's turn
        expect(heroA.child.attack.state.current).toBe(0);
        turn.next();
        // Assert: Current turn is Player A
        expect(turn.refer.current).toBe(playerA);
    })

    test('arcanite-reaper-break', async () => {
        // Player A attacks Player B's hero with weapon
        const promise = heroA.child.action.run();
        await CommonUtil.sleep();
        const selector = playerA.controller.current;
        // Assert: Controller selector is available
        expect(selector).toBeDefined();
        if (!selector) return;
        playerA.controller.set(heroB);
        await promise;

        // Assert: Player B's hero health is 25 (took 5 damage)
        expect(heroB.child.health.state.current).toBe(25);
        // Assert: Weapon is destroyed
        expect(heroA.child.weapon).toBeUndefined();
        // Assert: Hero attack becomes 0
        expect(heroA.child.attack.state.current).toBe(0);
    })
})

