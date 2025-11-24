/**
 * Test cases for Holy Light
 * 
 * 1. initial-state:
 *    - Player A has Fireball in hand
 *    - Player A has Frostbolt in hand
 *    - Player B has Holy Light in hand
 *    - Player B hero health 30
 * 2. fireball-cast:
 *    - Player A uses Fireball on Player B's hero
 *    - Assert: Player B hero health is 24 (30 - 6)
 * 3. frostbolt-cast:
 *    - Player A uses Frostbolt on Player B's hero
 *    - Assert: Player B hero health is 21 (24 - 3)
 * 4. holy-light-cast:
 *    - Turn switches to Player B
 *    - Player B uses Holy Light
 *    - Assert: Player B hero health is 29 (21 + 8)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { HolyLightModel } from "./index";
import { FireballModel } from "../../mage/fireball";
import { FrostboltModel } from "../../mage/frostbolt";
import { boot } from "../../boot";

describe('holy-light', () => {
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
                            cards: [new FireballModel(), new FrostboltModel()]
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
                        child: { 
                            cards: [new HolyLightModel()]
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
    const heroB = playerB.child.hero;
    
    const cardC = handA.child.cards.find(item => item instanceof FireballModel);
    const cardD = handA.child.cards.find(item => item instanceof FrostboltModel);
    const cardE = handB.child.cards.find(item => item instanceof HolyLightModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    test('fireball-cast', async () => {
        // Player A uses Fireball on Player B's hero
        let promise = cardC.play();
        await CommonUtil.sleep();
        playerA.controller.set(heroB);
        await promise;

        // Assert: Player B hero health is 24 (30 - 6)
        expect(heroB.child.health.state.current).toBe(24);
    });

    test('frostbolt-cast', async () => {
        // Player A uses Frostbolt on Player B's hero
        let promise = cardD.play();
        await CommonUtil.sleep();
        playerA.controller.set(heroB);
        await promise;

        // Assert: Player B hero health is 21 (24 - 3)
        expect(heroB.child.health.state.current).toBe(21);
    });

    test('holy-light-cast', async () => {
        // Turn switches to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Player B uses Holy Light
        await cardE.play();

        // Assert: Player B hero health is 29 (21 + 8)
        expect(heroB.child.health.state.current).toBe(29);
    });
});


