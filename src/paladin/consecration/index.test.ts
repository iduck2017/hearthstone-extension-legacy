/**
 * Test cases for Consecration
 * 
 * 1. initial-state:
 *    - Player A has Consecration in hand
 *    - Player B has Wisp (1/1) on board
 *    - Player B has Mana Wyrm (1/3) on board
 * 2. consecration-cast:
 *    - Player A uses Consecration
 *    - Assert: Player B's Wisp is destroyed
 *    - Assert: Player B's Mana Wyrm health is 1 (3 - 2)
 *    - Assert: Player B's hero health is 28 (30 - 2)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { ConsecrationModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { ManaWyrmModel } from "../../mage/mana-wyrm";
import { boot } from "../../boot";

describe('consecration', () => {
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
                            cards: [new ConsecrationModel()]
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
    const handA = playerA.child.hand;
    const playerB = game.child.playerB;
    const boardB = playerB.child.board;
    const heroB = playerB.child.hero;
    
    const cardC = handA.child.cards.find(item => item instanceof ConsecrationModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    const cardE = boardB.child.cards.find(item => item instanceof ManaWyrmModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    test('consecration-cast', async () => {
        // Player A uses Consecration
        let promise = cardC.play();
        await promise;

        // Assert: Player B's Wisp is destroyed
        expect(cardD.child.dispose.state.isActived).toBe(true);
        // Assert: Player B's Wisp health is -1 (1 - 2)
        expect(cardD.child.health.state.current).toBe(-1);
        // Assert: Player B's Mana Wyrm health is 1 (3 - 2)
        expect(cardE.child.health.state.current).toBe(1);
        // Assert: Player B's hero health is 28 (30 - 2)
        expect(heroB.child.health.state.current).toBe(28);
    });
});

