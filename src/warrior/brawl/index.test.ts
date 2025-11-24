/**
 * Test cases for Brawl
 * 
 * 1. initial-state:
 *    - Player A has Wisp (1/1) on board
 *    - Player A has Mana Wyrm (1/3) on board
 *    - Player A has Brawl in hand
 *    - Player B has Core Hound (9/5) on board
 * 2. brawl-cast:
 *    - Player A uses Brawl
 *    - Assert: Only one minion remains on the board (randomly selected)
 *    - Assert: Total minions on board is 1
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { BrawlModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { ManaWyrmModel } from "../../mage/mana-wyrm";
import { CoreHoundModel } from "../../neutral/core-hound";
import { boot } from "../../boot";

describe('brawl', () => {
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
                                new ManaWyrmModel()
                            ]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new BrawlModel()]
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
    
    const cardC = handA.child.cards.find(item => item instanceof BrawlModel);
    if (!cardC) throw new Error();

    test('brawl-cast', async () => {
        // Player A uses Brawl
        await cardC.play();

        // Assert: Only one minion remains on the board (randomly selected)
        const total = boardA.child.cards.length + boardB.child.cards.length;
        expect(total).toBe(1);
    });
});

