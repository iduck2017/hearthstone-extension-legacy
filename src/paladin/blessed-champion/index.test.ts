/**
 * Test cases for Blessed Champion
 * 
 * 1. initial-state:
 *    - Player A has Wisp (1/1) on board
 *    - Player A has Blessing of Might in hand
 *    - Player A has Blessed Champion in hand
 * 2. blessing-of-might-cast:
 *    - Player A uses Blessing of Might
 *    - Select target Player A's Wisp
 *    - Assert: Player A's Wisp attack is 4 (1 + 3)
 * 3. blessed-champion-cast:
 *    - Player A uses Blessed Champion
 *    - Select target Player A's Wisp
 *    - Assert: Player A's Wisp attack is 8 (4 * 2)
 * 4. wisp-attack:
 *    - Player A's Wisp attacks Player B's hero
 *    - Assert: Player B's hero health is 22 (30 - 8)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { BlessedChampionModel } from "./index";
import { BlessingOfMightModel } from "../blessing-of-might";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";

describe('blessed-champion', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new WispModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new BlessingOfMightModel(), new BlessedChampionModel()]
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
    const heroB = playerB.child.hero;
    const boardA = playerA.child.board;
    const handA = playerA.child.hand;
    
    const cardC = boardA.child.cards.find(item => item instanceof WispModel);
    const cardD = handA.child.cards.find(item => item instanceof BlessingOfMightModel);
    const cardE = handA.child.cards.find(item => item instanceof BlessedChampionModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    test('blessing-of-might-cast', async () => {
        // Player A uses Blessing of Might
        let promise = cardD.play();
        await CommonUtil.sleep();
        
        // Select target Player A's Wisp
        playerA.controller.set(cardC);
        await promise;

        // Assert: Player A's Wisp attack is 4 (1 + 3)
        expect(cardC.child.attack.state.current).toBe(4);
    });

    test('blessed-champion-cast', async () => {
        // Player A uses Blessed Champion
        let promise = cardE.play();
        await CommonUtil.sleep();
        
        // Select target Player A's Wisp
        playerA.controller.set(cardC);
        await promise;

        // Assert: Player A's Wisp attack is 8 (4 * 2)
        expect(cardC.child.attack.state.current).toBe(8);
    });

    test('wisp-attack', async () => {
        // Player A's Wisp attacks Player B's hero
        let promise = cardC.child.action.run();
        await CommonUtil.sleep();
        playerA.controller.set(heroB);
        await promise;

        // Assert: Player B's hero health is 22 (30 - 8)
        expect(heroB.child.health.state.current).toBe(22);
    });
});

