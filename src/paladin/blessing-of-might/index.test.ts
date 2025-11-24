/**
 * Test cases for Blessing of Might
 * 
 * 1. initial-state:
 *    - Player A has Wisp (1/1) on board
 *    - Player A has Blessing of Might in hand
 *    - Player B hero health 30
 * 2. blessing-of-might-cast:
 *    - Player A uses Blessing of Might
 *    - Select target Player A's Wisp
 *    - Assert: Player A's Wisp attack is 4 (1 + 3)
 * 3. wisp-attack:
 *    - Player A's Wisp attacks Player B's hero
 *    - Assert: Player B's hero health is 26 (30 - 4)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { BlessingOfMightModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";

describe('blessing-of-might', () => {
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
                            cards: [new BlessingOfMightModel()]
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
    const boardA = playerA.child.board;
    const handA = playerA.child.hand;
    const heroB = playerB.child.hero;
    
    const cardC = boardA.child.cards.find(item => item instanceof WispModel);
    const cardD = handA.child.cards.find(item => item instanceof BlessingOfMightModel);
    if (!cardC || !cardD) throw new Error();

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

    test('wisp-attack', async () => {
        // Player A's Wisp attacks Player B's hero
        let promise = cardC.child.action.run();
        await CommonUtil.sleep();
        playerA.controller.set(heroB);
        await promise;

        // Assert: Player B's hero health is 26 (30 - 4)
        expect(heroB.child.health.state.current).toBe(26);
    });
});

