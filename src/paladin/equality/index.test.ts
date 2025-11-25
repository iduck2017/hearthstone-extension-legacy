/**
 * Test cases for Equality
 * 
 * 1. initial-state:
 *    - Player A has Core Hound (9/5) on board
 *    - Player A has Blessing of Kings in hand
 *    - Player A has Equality in hand
 *    - Player B has Wisp (1/1) on board
 *    - Player B has Mana Wyrm (1/3) on board
 * 2. blessing-of-kings-cast:
 *    - Player A uses Blessing of Kings on Player B's Mana Wyrm
 *    - Assert: Player B's Mana Wyrm attack is 5 (1+4)
 *    - Assert: Player B's Mana Wyrm health is 7 (3+4)
 * 3. equality-cast:
 *    - Player A uses Equality
 *    - Assert: Player A's Core Hound health is 1 (changed from 5)
 *    - Assert: Player B's Wisp health is 1 (unchanged)
 *    - Assert: Player B's Mana Wyrm health is 1 (changed from 7)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { EqualityModel } from "./index";
import { BlessingOfKingsModel } from "../blessing-of-kings";
import { WispModel } from "../../neutral/wisp";
import { CoreHoundModel } from "../../neutral/core-hound";
import { ManaWyrmModel } from "../../mage/mana-wyrm";
import { boot } from "../../boot";

describe('equality', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new CoreHoundModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new BlessingOfKingsModel(), new EqualityModel()]
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
                            cards: [new WispModel(), new ManaWyrmModel()]
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
    const boardA = playerA.child.board;
    const handA = playerA.child.hand;
    const boardB = game.child.playerB.child.board;
    
    const cardC = boardA.child.cards.find(item => item instanceof CoreHoundModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    const cardE = boardB.child.cards.find(item => item instanceof ManaWyrmModel);
    const cardF = handA.child.cards.find(item => item instanceof BlessingOfKingsModel);
    const cardG = handA.child.cards.find(item => item instanceof EqualityModel);
    if (!cardC || !cardD || !cardE || !cardF || !cardG) throw new Error();

    test('blessing-of-kings-cast', async () => {
        // Player A uses Blessing of Kings
        let promise = cardF.play();
        await CommonUtil.sleep();
        
        // Select target Player B's Mana Wyrm
        playerA.controller.set(cardE);
        await promise;

        // Assert: Player B's Mana Wyrm attack is 5 (1+4)
        expect(cardE.child.attack.state.current).toBe(5);
        // Assert: Player B's Mana Wyrm health is 7 (3+4)
        expect(cardE.child.health.state.current).toBe(7);
    });

    test('equality-cast', async () => {
        // Player A uses Equality
        let promise = cardG.play();
        await promise;

        // Assert: Player A's Core Hound health is 1 (changed from 5)
        expect(cardC.child.health.state.current).toBe(1);
        // Assert: Player B's Wisp health is 1 (unchanged)
        expect(cardD.child.health.state.current).toBe(1);
        // Assert: Player B's Mana Wyrm health is 1 (changed from 7)
        expect(cardE.child.health.state.current).toBe(1);
    });
});

