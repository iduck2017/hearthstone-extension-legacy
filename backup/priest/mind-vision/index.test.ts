/**
 * Test cases for Mind Vision
 * Initial state: Player A has Mind Vision in hand. Player B has Water Elemental in hand.
 * mind-vision-cast: Player A uses Mind Vision, copies Water Elemental from Player B's hand.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel } from "hearthstone-core";
import { MindVisionModel } from "./index";
import { WaterElementalModel } from "../../mage/water-elemental";
import { boot } from "../../boot";

describe('mind-vision', () => {
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
                            cards: [new MindVisionModel()]
                        }
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
                        child: { 
                            cards: [new WaterElementalModel()]
                        }
                    })
                }
            })
        }
    });
    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const handA = playerA.child.hand;
    const handB = playerB.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof MindVisionModel);
    const cardD = handB.child.cards.find(item => item instanceof WaterElementalModel);
    if (!cardC || !cardD) throw new Error();

    test('mind-vision-cast', async () => {
        // Check initial state
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(1);
        expect(handB.child.cards.length).toBe(1);

        // Player A uses Mind Vision
        const promise = cardC.play();
        await promise;

        // Player A should have copied Water Elemental in hand
        const cardE = handA.child.cards.find(item => item instanceof WaterElementalModel);
        if (!cardE) throw new Error();
        expect(handA.child.cards.length).toBe(1);
        expect(cardE).not.toBe(cardD); // Mind Vision should copy a different card
        expect(cardE.refer.creator).toBe(cardD); // Mind Vision should copy the correct card
        
        // Player B's hand should be unchanged
        expect(handB.child.cards.length).toBe(1);
        
        // Check mana cost
        expect(playerA.child.mana.state.current).toBe(9); // 10 - 1 cost
    });
});
