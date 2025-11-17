/**
 * Test cases for Shadowed Spirit
 * 
 * Initial state: Player A has Shadowed Spirit on board.
 * Player B has a hero with full health.
 * 
 * 1. shadowed-spirit-death: Player A's Shadowed Spirit dies, dealing 3 damage to Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { ShadowedSpiritModel } from "./index";
import { WaterElementalModel } from "../../mage/water-elemental";
import { boot } from "../../boot";

describe('shadowed-spirit', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new ShadowedSpiritModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: []
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
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const cardC = boardA.child.cards.find(item => item instanceof ShadowedSpiritModel);
    const cardD = boardB.child.cards.find(item => item instanceof WaterElementalModel);
    if (!cardC || !cardD) throw new Error();
    const heroB = playerB.child.hero;

    test('shadowed-spirit-death', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(4); // Shadowed Spirit: 3/4
        expect(cardC.child.health.state.current).toBe(3);
        expect(cardD.child.attack.state.current).toBe(3); // Water Elemental: 3/6
        expect(cardD.child.health.state.current).toBe(6);
        expect(heroB.child.health.state.current).toBe(30); // Full health

        // Shadowed Spirit attacks Water Elemental, Shadowed Spirit dies
        let promise = cardC.child.action.run();
        await AnimeUtil.sleep();
        expect(playerA.child.controller.current?.options).toContain(cardD);
        playerA.child.controller.set(cardD);
        await promise;

        // Shadowed Spirit should die, Water Elemental should survive
        expect(cardC.child.dispose.status).toBe(true);
        expect(cardD.child.dispose.status).toBe(false);
        expect(boardA.child.cards.length).toBe(0);
        expect(boardB.child.cards.length).toBe(1);

        // Enemy hero should take 3 damage from Shadowed Spirit's deathrattle
        expect(heroB.child.health.state.current).toBe(27); // 30 - 3 = 27
    });
});