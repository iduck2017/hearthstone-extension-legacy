/**
 * Test cases for Divine Spirit
 * 
 * Initial state: Player A has Divine Spirit in hand.
 * Player A has Water Elemental (3/6) on board.
 * 
 * 1. divine-spirit-cast: Player A uses Divine Spirit on Water Elemental, doubles its Health.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { DivineSpiritModel } from "./index";
import { WaterElementalModel } from "../../mage/water-elemental";
import { boot } from "../../boot";

describe('divine-spirit', () => {
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
                            cards: [new DivineSpiritModel()]
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
                        child: { cards: [] }
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
    const boardA = playerA.child.board;
    const handA = playerA.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof DivineSpiritModel);
    const cardD = boardA.child.cards.find(item => item instanceof WaterElementalModel);
    if (!cardC || !cardD) throw new Error();

    test('divine-spirit-cast', async () => {
        // Check initial state
        expect(cardD.child.attack.state.current).toBe(3); // Water Elemental: 3/6
        expect(cardD.child.health.state.current).toBe(6);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(1);

        // Player A uses Divine Spirit on Water Elemental
        const promise = cardC.play();
        expect(playerA.child.controller.current?.options).toContain(cardD); // Water Elemental should be targetable
        playerA.child.controller.set(cardD);
        await promise;

        // Water Elemental should have doubled Health
        expect(cardD.child.attack.state.current).toBe(3); // Attack unchanged
        expect(cardD.child.health.state.current).toBe(12); // 6 + 6 = 12 (doubled)

        // Divine Spirit should be consumed
        expect(handA.child.cards.length).toBe(0); // Divine Spirit consumed
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 cost
    });
});
