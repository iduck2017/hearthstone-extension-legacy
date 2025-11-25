/**
 * Test cases for Tirion Fordring
 *
 * 1. initial-state:
 *    - Player A has Tirion Fordring in hand
 *    - Player B has Wisp on board
 *    - Player B has Core Hound on board
 *    - Player B has Fireball in hand
 * 2. tirion-fordring-play:
 *    - Player A plays Tirion Fordring
 *    - Select position 0
 *    - Assert: Tirion Fordring is on board
 *    - Assert: Tirion Fordring has Divine Shield
 *    - Assert: Tirion Fordring has Taunt
 * 3. wisp-attack:
 *    - Turn switches to Player B
 *    - Player B's Wisp attacks Tirion Fordring
 *    - Assert: Tirion Fordring's Divine Shield is consumed
 *    - Assert: Player B's Wisp is destroyed
 * 4. fireball-cast:
 *    - Player B uses Fireball on Tirion Fordring
 *    - Assert: Tirion Fordring is destroyed
 *    - Assert: Player A's hero has Ashbringer equipped (5/3)
 * 5. ashbringer-attack:
 *    - Turn switches to Player A
 *    - Player A's hero attacks Player B's Core Hound
 *    - Assert: Player B's Core Hound takes 5 damage
 *    - Assert: Player A's hero health
 *    - Assert: Player B's Core Hound health
 *    - Assert: Player B's Core Hound is destroyed
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil, MinionCardModel } from "hearthstone-core";
import { TirionFordringModel } from "./index";
import { AshbringerModel } from "../ashbringer";
import { WispModel } from "../../neutral/wisp";
import { CoreHoundModel } from "../../neutral/core-hound";
import { FireballModel } from "../../mage/fireball";
import { boot } from "../../boot";

describe('tirion-fordring', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: {
                            cards: [new TirionFordringModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { cards: [] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: {
                            cards: [new WispModel(), new CoreHoundModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: {
                            cards: [new FireballModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { cards: [] }
                    })
                }
            })
        }
    });

    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const heroA = playerA.child.hero;
    const handA = playerA.child.hand;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const handB = playerB.child.hand;

    const cardC = handA.child.cards.find(item => item instanceof TirionFordringModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel) as MinionCardModel | undefined;
    const cardE = boardB.child.cards.find(item => item instanceof CoreHoundModel) as MinionCardModel | undefined;
    const cardF = handB.child.cards.find(item => item instanceof FireballModel);
    if (!cardC || !cardD || !cardE || !cardF) throw new Error();

    test('tirion-fordring-play', async () => {
        // Player A plays Tirion Fordring
        let promise = cardC.play();
        await CommonUtil.sleep();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Assert: Tirion Fordring is on board
        expect(boardA.child.cards.length).toBe(1);
        const tirion = boardA.child.cards.find(item => item instanceof TirionFordringModel);
        expect(tirion).toBeDefined();
        if (!tirion) throw new Error();

        // Assert: Tirion Fordring has Divine Shield
        expect(tirion.child.divineShield.state.isEnabled).toBe(true);
        
        // Assert: Tirion Fordring has Taunt
        expect(tirion.child.taunt.state.isEnabled).toBe(true);
    });

    test('wisp-attack', async () => {
        // Find Tirion on board
        const tirion = boardA.child.cards.find(item => item instanceof TirionFordringModel);
        if (!tirion) throw new Error();

        // Turn switches to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Player B's Wisp attacks Tirion Fordring
        let promise = cardD.child.action.run();
        await CommonUtil.sleep();
        playerB.controller.set(tirion);
        await promise;

        // Assert: Tirion Fordring's Divine Shield is consumed
        expect(tirion.child.divineShield.state.isEnabled).toBe(false);
        
        // Assert: Player B's Wisp is destroyed
        expect(cardD.child.dispose.state.isActived).toBe(true);
    });

    test('fireball-cast', async () => {
        // Find Tirion on board
        const tirion = boardA.child.cards.find(item => item instanceof TirionFordringModel);
        if (!tirion) throw new Error();

        // Player B uses Fireball on Tirion Fordring
        let promise = cardF.play();
        await CommonUtil.sleep();
        playerB.controller.set(tirion);
        await promise;

        // Assert: Tirion Fordring is destroyed
        expect(tirion.child.dispose.state.isActived).toBe(true);
        
        // Assert: Player A's hero has Ashbringer equipped (5/3)
        const weapon = heroA.child.weapon;
        expect(weapon).toBeDefined();
        if (!weapon) throw new Error();
        expect(weapon instanceof AshbringerModel).toBe(true);
        expect(weapon.child.attack.state.origin).toBe(5);
        expect(weapon.child.action.state.origin).toBe(3);
    });

    test('ashbringer-attack', async () => {
        // Turn switches to Player A
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerA);

        // Player A's hero attacks Player B's Core Hound
        let promise = heroA.child.action.run();
        await CommonUtil.sleep();
        playerA.controller.set(cardE);
        await promise;

        // Assert: Player B's Core Hound takes 5 damage and is destroyed
        expect(cardE.child.health.state.current).toBe(0); // 7 - 5 = 2, but destroyed
        
        // Assert: Player A's hero health (takes 9 damage from Core Hound)
        expect(heroA.child.health.state.current).toBe(21); // 30 - 9 = 21
        
        // Assert: Player B's Core Hound is destroyed
        expect(cardE.child.dispose.state.isActived).toBe(true);
    });
});
