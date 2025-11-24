/**
 * Test cases for Hand of Protection
 * 
 * 1. initial-state:
 *    - Player A has Wisp (1/1) on board
 *    - Player A has Hand of Protection in hand
 *    - Player B has Wisp (1/1) on board
 * 2. hand-of-protection-cast:
 *    - Player A uses Hand of Protection
 *    - Select target Player A's Wisp
 *    - Assert: Player A's Wisp has Divine Shield
 * 3. wisp-attack:
 *    - Player B's Wisp attacks Player A's Wisp
 *    - Assert: Player A's Wisp Divine Shield is consumed
 *    - Assert: Player A's Wisp health is 1 (not damaged)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { HandOfProtectionModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";

describe('hand-of-protection', () => {
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
                            cards: [new HandOfProtectionModel()]
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
                            cards: [new WispModel()]
                        }
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
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    
    const cardC = boardA.child.cards.find(item => item instanceof WispModel);
    const cardD = handA.child.cards.find(item => item instanceof HandOfProtectionModel);
    const cardE = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    test('hand-of-protection-cast', async () => {
        // Player A uses Hand of Protection
        let promise = cardD.play();
        await CommonUtil.sleep();
        
        // Select target Player A's Wisp
        playerA.controller.set(cardC);
        await promise;

        // Assert: Player A's Wisp has Divine Shield
        expect(cardC.child.divineShield.state.isEnabled).toBe(true);
    });

    test('wisp-attack', async () => {
        // Turn switches to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Player B's Wisp attacks Player A's Wisp
        let promise = cardE.child.action.run();
        await CommonUtil.sleep();
        playerB.controller.set(cardC);
        await promise;

        // Assert: Player A's Wisp Divine Shield is consumed
        expect(cardC.child.divineShield.state.isEnabled).toBe(false);
        // Assert: Player A's Wisp health is 1 (not damaged)
        expect(cardC.child.health.state.current).toBe(1);
    });
});

