/**
 * Test cases for Blessing of Kings
 * 
 * 1. initial-state:
 *    - Player A has Wisp (1/1) on board
 *    - Player A has Blessing of Kings in hand
 *    - Player B has Wisp (1/1) on board
 * 2. blessing-of-kings-cast:
 *    - Player A uses Blessing of Kings
 *    - Select target Player A's Wisp
 *    - Assert: Player A's Wisp attack is 5 (1 + 4)
 *    - Assert: Player A's Wisp health is 5 (1 + 4)
 * 3. wisp-attack:
 *    - Player A's Wisp attacks Player B's Wisp
 *    - Assert: Player B's Wisp is destroyed
 *    - Assert: Player A's Wisp health is 4 (5 - 1)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { BlessingOfKingsModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";

describe('blessing-of-kings', () => {
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
                            cards: [new BlessingOfKingsModel()]
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
                        child: { cards: [new WispModel()] }
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
    const boardA = playerA.child.board;
    const handA = playerA.child.hand;
    const boardB = game.child.playerB.child.board;
    
    const cardC = boardA.child.cards.find(item => item instanceof WispModel);
    const cardD = handA.child.cards.find(item => item instanceof BlessingOfKingsModel);
    const cardE = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD || !cardE) throw new Error("Missing cards for test setup.");

    test('blessing-of-kings-cast', async () => {
        // Player A uses Blessing of Kings
        let promise = cardD.play();
        await CommonUtil.sleep();
        
        // Select target Player A's Wisp
        playerA.controller.set(cardC);
        await promise;

        // Assert: Player A's Wisp attack is 5 (1 + 4)
        expect(cardC.child.attack.state.current).toBe(5);
        // Assert: Player A's Wisp health is 5 (1 + 4)
        expect(cardC.child.health.state.current).toBe(5);
    });

    test('wisp-attack', async () => {
        // Player A's Wisp attacks Player B's Wisp
        let promise = cardC.child.action.run();
        await CommonUtil.sleep();
        playerA.controller.set(cardE);
        await promise;

        // Assert: Player B's Wisp health is -4 (1 - 5)
        expect(cardE.child.health.state.current).toBe(-4);
        // Assert: Player B's Wisp is destroyed
        expect(cardE.child.dispose.state.isActived).toBe(true);
        // Assert: Player A's Wisp health is 4 (5 - 1)
        expect(cardC.child.health.state.current).toBe(4);
    });
});

