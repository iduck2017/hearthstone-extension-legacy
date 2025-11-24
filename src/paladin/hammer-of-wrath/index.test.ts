/**
 * Test cases for Hammer of Wrath
 * 
 * 1. initial-state:
 *    - Player A has Hammer of Wrath in hand
 *    - Player A deck has 1 card
 *    - Player B hero health 30
 * 2. hammer-of-wrath-cast:
 *    - Player A uses Hammer of Wrath
 *    - Select target Player B's hero
 *    - Assert: Player B hero health is 27 (30 - 3)
 *    - Assert: Player A's hand size is 1 (Hammer of Wrath consumed, 1 card drawn)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { HammerOfWrathModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";

describe('hammer-of-wrath', () => {
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
                            cards: [new HammerOfWrathModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { cards: [new WispModel()] }
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
    const handA = playerA.child.hand;
    const heroB = game.child.playerB.child.hero;
    
    const cardC = handA.child.cards.find(item => item instanceof HammerOfWrathModel);
    if (!cardC) throw new Error("Missing cards for test setup.");

    test('hammer-of-wrath-cast', async () => {
        // Player A uses Hammer of Wrath
        let promise = cardC.play();
        await CommonUtil.sleep();
        
        // Select target Player B's hero
        playerA.controller.set(heroB);
        await promise;

        // Assert: Player B hero health is 27 (30 - 3)
        expect(heroB.child.health.state.current).toBe(27);
        // Assert: Player A's hand size is 1 (Hammer of Wrath consumed, 1 card drawn)
        expect(handA.child.cards.length).toBe(1);
    });
});

