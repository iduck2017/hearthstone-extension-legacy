/**
 * Test cases for Guardian of Kings
 *
 * 1. initial-state:
 *    - Player A has Fireball in hand
 *    - Player B has Guardian of Kings in hand
 * 2. fireball-cast:
 *    - Player A uses Fireball on Player B's hero
 *    - Assert: Player B's hero health is 24 (30 - 6)
 * 3. guardian-of-kings-play:
 *    - Turn switches to Player B
 *    - Player B plays Guardian of Kings
 *    - Select position 0
 *    - Assert: Player B's hero health is 30 (24 + 6)
 *    - Assert: Guardian of Kings has Taunt
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { GuardianOfKingsModel } from "./index";
import { FireballModel } from "../../mage/fireball";
import { boot } from "../../boot";

describe('guardian-of-kings', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    hand: new HandModel({
                        child: {
                            cards: [new FireballModel()]
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
                            cards: [new GuardianOfKingsModel()]
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
    const heroB = playerB.child.hero;
    const handA = playerA.child.hand;
    const handB = playerB.child.hand;
    const boardB = playerB.child.board;

    const cardC = handA.child.cards.find(item => item instanceof FireballModel);
    const cardD = handB.child.cards.find(item => item instanceof GuardianOfKingsModel);
    if (!cardC || !cardD) throw new Error();

    test('fireball-cast', async () => {
        expect(heroB.child.health.state.current).toBe(30);

        // Player A uses Fireball on Player B's hero
        let promise = cardC.play();
        await CommonUtil.sleep();
        playerA.controller.set(heroB);
        await promise;

        // Assert: Player B's hero health is 24 (30 - 6)
        expect(heroB.child.health.state.current).toBe(24);
    });

    test('guardian-of-kings-play', async () => {
        // Turn switches to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Player B plays Guardian of Kings
        let promise = cardD.play();
        await CommonUtil.sleep();
        playerB.controller.set(0); // Select position 0
        await promise;

        // Assert: Guardian of Kings is on board
        expect(boardB.child.cards.length).toBe(1);

        // Assert: Player B's hero health is 30 (24 + 6, capped at maximum)
        expect(heroB.child.health.state.current).toBe(30);
        
        // Assert: Guardian of Kings has Taunt
        expect(cardD.child.taunt.state.isEnabled).toBe(true);
    });
});
