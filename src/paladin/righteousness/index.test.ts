/**
 * Test cases for Righteousness
 * 
 * 1. initial-state:
 *    - Player A has 5 Wisp (1/1) on board
 *    - Player A has Righteousness in hand
 *    - Player B has Core Hound (9/5) on board
 * 2. righteousness-cast:
 *    - Player A uses Righteousness
 *    - Assert: All Player A's Wisps have Divine Shield
 * 3. wisps-attack:
 *    - All Player A's Wisps attack Player B's Core Hound
 *    - Assert: Player B's Core Hound is destroyed
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { RighteousnessModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { CoreHoundModel } from "../../neutral/core-hound";
import { boot } from "../../boot";

describe('righteousness', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [
                                new WispModel(),
                                new WispModel(),
                                new WispModel(),
                                new WispModel(),
                                new WispModel()
                            ]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new RighteousnessModel()]
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
    
    const wisps = boardA.child.cards.filter(item => item instanceof WispModel);
    const cardD = boardB.child.cards.find(item => item instanceof CoreHoundModel);
    const cardF = handA.child.cards.find(item => item instanceof RighteousnessModel);
    if (wisps.length !== 5 || !cardD || !cardF) throw new Error();

    test('righteousness-cast', async () => {
        // Player A uses Righteousness
        await cardF.play();

        // Assert: All Player A's Wisps have Divine Shield
        for (const wisp of wisps) {
            expect(wisp.child.divineShield.state.isEnabled).toBe(true);
        }
    });

    test('wisps-attack', async () => {
        // All Player A's Wisps attack Player B's Core Hound
        for (const wisp of wisps) {
            let promise = wisp.child.action.run();
            await CommonUtil.sleep();
            playerA.controller.set(cardD);
            await promise;
        }

        // Assert: Player B's Core Hound is destroyed
        expect(cardD.child.dispose.state.isActived).toBe(true);
        // Assert: Player B's Core Hound health is 0 (5 - 5)
        expect(cardD.child.health.state.current).toBe(0);
        
        // Assert: All Player A's Wisps are alive
        for (const wisp of wisps) {
            expect(wisp.child.dispose.state.isActived).toBe(false);
            expect(wisp.child.health.state.current).toBe(1);
        }
    });
});

