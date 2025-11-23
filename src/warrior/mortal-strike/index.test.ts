/**
 * Test cases for Mortal Strike
 * 
 * 1. initial-state:
 *    - Player A hero health 30
 *    - Player A has Mortal Strike in hand
 *    - Player B hero health 15
 *    - Player B has Mortal Strike in hand
 * 2. mortal-strike-cast:
 *    - Player A uses Mortal Strike
 *    - Select target Player B's hero
 *    - Assert: Player B's hero health is 11 (15 - 4)
 * 3. mortal-strike-cast:
 *    - Switch to Player B's turn
 *    - Player B uses Mortal Strike
 *    - Select target Player A's hero
 *    - Assert: Player A's hero health is 24 (30 - 6, because Player B's health is 11 ≤ 12)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil, RoleHealthModel } from "hearthstone-core";
import { MortalStrikeModel } from "./index";
import { boot } from "../../boot";

describe('mortal-strike', () => {
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
                            cards: [new MortalStrikeModel()]
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
                    hero: new MageModel({
                        child: {
                            health: new RoleHealthModel({
                                state: { damage: 15, origin: 30 }
                            })
                        }
                    }),
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new MortalStrikeModel()]
                        }
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
    const handA = playerA.child.hand;
    const handB = playerB.child.hand;
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;
    
    const cardC = handA.child.cards.find(item => item instanceof MortalStrikeModel);
    const cardD = handB.child.cards.find(item => item instanceof MortalStrikeModel);
    if (!cardC || !cardD) throw new Error();

    test('mortal-strike-cast', async () => {
        // Player A uses Mortal Strike
        let promise = cardC.play();
        await CommonUtil.sleep();
        
        // Select target Player B's hero
        playerA.controller.set(heroB);
        await promise;

        // Assert: Player B's hero health is 11 (15 - 4)
        expect(heroB.child.health.state.current).toBe(11);
    });

    test('mortal-strike-cast', async () => {
        // Switch to Player B's turn
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);
        
        // Player B uses Mortal Strike
        let promise = cardD.play();
        await CommonUtil.sleep();
        
        // Select target Player A's hero
        playerB.controller.set(heroA);
        await promise;

        // Assert: Player A's hero health is 24 (30 - 6, because Player B's health is 11 ≤ 12)
        expect(heroA.child.health.state.current).toBe(24);
    });
});

