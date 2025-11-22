/**
 * Test cases for Circle of Healing
 * 
 * Initial state: Player A has Water Elemental on board, Circle of Healing and Frostbolt in hand. Player B has Water Elemental on board.
 * 
 * 1. water-elemental-attack: Player A's Water Elemental attacks Player B's Water Elemental
 * 2. frostbolt-cast: Player A uses Frostbolt on Player B's hero
 * 3. circle-of-healing-cast: Player A plays Circle of Healing, heals all minions but not heroes
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, CommonUtil } from "hearthstone-core";
import { CircleOfHealingModel } from "./index";
import { FrostboltModel } from "../../mage/frostbolt";
import { WaterElementalModel } from "../../mage/water-elemental";
import { boot } from "../../boot";

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
                            cards: [new WaterElementalModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new CircleOfHealingModel(), new FrostboltModel()]
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
                            cards: [new WaterElementalModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
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
    const cardC = boardA.child.cards.find(item => item instanceof WaterElementalModel);
    const cardD = boardB.child.cards.find(item => item instanceof WaterElementalModel);
    const cardE = handA.child.cards.find(item => item instanceof FrostboltModel);
    const cardF = handA.child.cards.find(item => item instanceof CircleOfHealingModel);
    if (!cardC || !cardD || !cardE || !cardF) throw new Error();
    const heroB = playerB.child.hero;

    test('water-elemental-attack', async () => {
        // Check initial stats
        expect(cardC.child.health.state.current).toBe(6); // Player A's Water Elemental: 3/6
        expect(cardD.child.health.state.current).toBe(6); // Player B's Water Elemental: 3/6
        expect(heroB.child.health.state.current).toBe(30); // Player B hero: 30 health

        // Player A's Water Elemental attacks Player B's Water Elemental
        const promise = cardC.child.action.run();
        await CommonUtil.sleep();
        expect(playerA.controller.current?.options).toContain(cardD);
        playerA.controller.set(cardD);
        await promise;

        // Both Water Elementals should take 3 damage
        expect(cardC.child.health.state.current).toBe(3); // Player A's Water Elemental: 6 - 3 = 3
        expect(cardD.child.health.state.current).toBe(3); // Player B's Water Elemental: 6 - 3 = 3
        expect(heroB.child.health.state.current).toBe(30); // Hero should not be affected
    });

    test('frostbolt-cast', async () => {
        // Check current stats
        expect(heroB.child.health.state.current).toBe(30); // Player B hero: 30 health
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(2);

        // Player A uses Frostbolt on Player B's hero
        const promise = cardE.play();
        expect(playerA.controller.current?.options).toContain(heroB);
        playerA.controller.set(heroB);
        await promise;

        // Player B's hero should take 3 damage
        expect(heroB.child.health.state.current).toBe(27); // 30 - 3 = 27
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 cost
        expect(handA.child.cards.length).toBe(1); // Frostbolt consumed
    });

    test('circle-of-healing-cast', async () => {
        // Check current stats before healing
        expect(cardC.child.health.state.current).toBe(3); // Player A's Water Elemental: 3/6, damaged
        expect(cardD.child.health.state.current).toBe(3); // Player B's Water Elemental: 3/6, damaged
        expect(heroB.child.health.state.current).toBe(27); // Player B hero: 27 health, damaged
        expect(playerA.child.mana.state.current).toBe(8);
        expect(handA.child.cards.length).toBe(1);

        // Player A plays Circle of Healing - no target selection needed
        await cardF.play();

        // Only minions should be healed, not heroes
        expect(cardC.child.health.state.current).toBe(6); // Player A's Water Elemental: 3 + 4 = 6 (full health)
        expect(cardD.child.health.state.current).toBe(6); // Player B's Water Elemental: 3 + 4 = 6 (full health)
        expect(heroB.child.health.state.current).toBe(27); // Player B hero: 27 health (unchanged - heroes not affected)

        expect(playerA.child.mana.state.current).toBe(8); // 8 - 0 cost
        expect(handA.child.cards.length).toBe(0); // Circle of Healing consumed
    });
});
