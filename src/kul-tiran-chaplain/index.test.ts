/**
 * Test cases for Kul Tiran Chaplain
 * 
 * Initial state: Player A has Kul Tiran Chaplain in hand.
 * Player A has Water Elemental (3/6) on board.
 * 
 * 1. kul-tiran-chaplain-play: Player A plays Kul Tiran Chaplain, gives Water Elemental +2 Health.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { KulTiranChaplainModel } from "./index";
import { WaterElementalModel } from "../water-elemental";
import { boot } from "../boot";

describe('kul-tiran-chaplain', () => {
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
                            minions: [new KulTiranChaplainModel()],
                            spells: []
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
                        child: { minions: [] }
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
    const boardA = playerA.child.board;
    const handA = playerA.child.hand;
    const cardC = handA.child.minions.find(item => item instanceof KulTiranChaplainModel);
    const cardD = boardA.child.minions.find(item => item instanceof WaterElementalModel);
    if (!cardC || !cardD) throw new Error();
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;

    test('kul-tiran-chaplain-play', async () => {
        // Check initial state
        expect(roleD.child.attack.state.current).toBe(3); // Water Elemental: 3/6
        expect(roleD.child.health.state.current).toBe(6);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(boardA.child.minions.length).toBe(1);
        expect(handA.refer.queue.length).toBe(1);

        // Player A plays Kul Tiran Chaplain
        const promise = cardC.play();
        playerA.child.controller.set(0);
        await AnimeUtil.sleep();
        expect(playerA.child.controller.current?.options).toContain(cardD.child.role); // Water Elemental should be targetable
        playerA.child.controller.set(cardD.child.role);
        await promise;

        // Check that Kul Tiran Chaplain is on board
        expect(boardA.child.minions.length).toBe(2);
        expect(roleC.child.attack.state.current).toBe(2); // Kul Tiran Chaplain: 3/2
        expect(roleC.child.health.state.current).toBe(3);

        // Water Elemental should have +2 Health
        expect(roleD.child.attack.state.current).toBe(3); // Attack unchanged
        expect(roleD.child.health.state.current).toBe(8); // 6 + 2 = 8

        // Kul Tiran Chaplain should be consumed
        expect(handA.refer.queue.length).toBe(0); // Kul Tiran Chaplain consumed
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 cost
    });
});
