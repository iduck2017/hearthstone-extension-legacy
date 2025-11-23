/**
 * Test cases for Shadow Word: Ruin
 * 
 * 1. initial-state:
 *    - Player A has Shadow Word: Ruin in hand
 *    - Player A has Wisp (1/1) on board
 *    - Player A has Water Elemental (3/6) on board
 *    - Player A has Stranglethorn Tiger (5/5) on board
 *    - Player B has Core Hound (9/5) on board
 * 2. shadow-word-ruin-cast:
 *    - Player A uses Shadow Word: Ruin
 *    - Assert: Stranglethorn Tiger (attack >= 5) is destroyed
 *    - Assert: Core Hound (attack >= 5) is destroyed
 *    - Assert: Wisp (attack < 5) survives
 *    - Assert: Water Elemental (attack < 5) survives
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { ShadowWordRuinModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { WaterElementalModel } from "../../mage/water-elemental";
import { StranglethornTigerModel } from "../../neutral/stranglethorn-tiger";
import { CoreHoundModel } from "../../neutral/core-hound";
import { boot } from "../../boot";

describe('shadow-word-ruin', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new WispModel(), new WaterElementalModel(), new StranglethornTigerModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new ShadowWordRuinModel()]
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
                            cards: [new CoreHoundModel()]
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
    const handA = playerA.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof ShadowWordRuinModel);
    const cardD = boardA.child.cards.find(item => item instanceof WispModel);
    const cardE = boardA.child.cards.find(item => item instanceof WaterElementalModel);
    const cardF = boardA.child.cards.find(item => item instanceof StranglethornTigerModel);
    const cardG = boardB.child.cards.find(item => item instanceof CoreHoundModel);
    if (!cardC || !cardD || !cardE || !cardF || !cardG) throw new Error();

    // initial-state:
    // - Player A has Shadow Word: Ruin in hand
    // - Player A has Wisp (1/1) on board
    // - Player A has Water Elemental (3/6) on board
    // - Player A has Stranglethorn Tiger (5/5) on board
    // - Player B has Core Hound (9/5) on board

    test('shadow-word-ruin-cast', async () => {
        // Player A uses Shadow Word: Ruin
        await cardC.play();

        // Assert: Stranglethorn Tiger (attack >= 5) is destroyed
        expect(cardF.child.dispose.state.isActived).toBe(true);
        
        // Assert: Core Hound (attack >= 5) is destroyed
        expect(cardG.child.dispose.state.isActived).toBe(true);
        
        // Assert: Wisp (attack < 5) survives
        expect(cardD.child.dispose.state.isActived).toBe(false);
        
        // Assert: Water Elemental (attack < 5) survives
        expect(cardE.child.dispose.state.isActived).toBe(false);

        expect(boardA.child.cards.length).toBe(2);
        expect(boardB.child.cards.length).toBe(0);
    });
});
