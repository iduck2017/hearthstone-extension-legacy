/**
 * Test cases for Armorsmith
 * 
 * 1. initial-state:
 *    - Player A has Armorsmith (1/4) on board
 *    - Player A has Mana Wyrm (1/3) on board
 *    - Player A hero armor 0
 *    - Player A has Whirlwind in hand
 *    - Player B has Wisp (1/1) on board
 * 2. mana-wyrm-attack:
 *    - Player A's Mana Wyrm attacks Player B's Wisp
 *    - Assert: Player B's Wisp is destroyed
 *    - Assert: Player A's Mana Wyrm health is 2 (3 - 1)
 *    - Assert: Player A hero armor is 1 (gained from Mana Wyrm taking damage)
 * 3. whirlwind-cast:
 *    - Player A uses Whirlwind
 *    - Assert: Player A's Armorsmith health is 3 (4 - 1)
 *    - Assert: Player A's Mana Wyrm health is 1 (2 - 1)
 *    - Assert: Player A hero armor is 3 (1 + 1 + 1, from Armorsmith and Mana Wyrm taking damage)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { ArmorsmithModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { ManaWyrmModel } from "../../mage/mana-wyrm";
import { WhirlwindModel } from "../whirlwind";
import { boot } from "../../boot";

describe('armorsmith', () => {
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
                                new ArmorsmithModel(),
                                new ManaWyrmModel()
                            ]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new WhirlwindModel()]
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
    const handA = playerA.child.hand;
    const heroA = playerA.child.hero;
    
    const cardC = boardA.child.cards.find(item => item instanceof ArmorsmithModel);
    const cardD = boardA.child.cards.find(item => item instanceof ManaWyrmModel);
    const cardE = handA.child.cards.find(item => item instanceof WhirlwindModel);
    const cardF = playerB.child.board.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD || !cardE || !cardF) throw new Error();

    test('mana-wyrm-attack', async () => {
        // Player A's Mana Wyrm attacks Player B's Wisp
        let promise = cardD.child.action.run();
        await CommonUtil.sleep();
        playerA.controller.set(cardF);
        await promise;

        // Assert: Player B's Wisp is destroyed
        expect(cardF.child.dispose.state.isActived).toBe(true);
        // Assert: Player A's Mana Wyrm health is 2 (3 - 1)
        expect(cardD.child.health.state.current).toBe(2);
        // Assert: Player A hero armor is 1 (gained from Mana Wyrm taking damage)
        expect(heroA.child.armor.state.current).toBe(1);
    });

    test('whirlwind-cast', async () => {
        // Player A uses Whirlwind
        let promise = cardE.play();
        await promise;

        // Assert: Player A's Armorsmith health is 3 (4 - 1)
        expect(cardC.child.health.state.current).toBe(3);
        // Assert: Player A's Mana Wyrm health is 1 (2 - 1)
        expect(cardD.child.health.state.current).toBe(1);
        // Assert: Player A hero armor is 3 (1 + 1 + 1, from Armorsmith and Mana Wyrm taking damage)
        expect(heroA.child.armor.state.current).toBe(3);
    });
});

