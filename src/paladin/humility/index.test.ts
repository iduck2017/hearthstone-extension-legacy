/**
 * Test cases for Humility
 * 
 * 1. initial-state:
 *    - Player A has Core Hound (9/5) on board
 *    - Player A has Blessing of Kings in hand
 *    - Player A has Humility in hand
 *    - Player A has Blessing of Might in hand
 *    - Player B hero health 30
 * 2. blessing-of-kings-cast:
 *    - Player A uses Blessing of Kings
 *    - Select target Player A's Core Hound
 *    - Assert: Player A's Core Hound attack is 13 (9 + 4)
 *    - Assert: Player A's Core Hound health is 9 (5 + 4)
 * 3. humility-cast:
 *    - Player A uses Humility
 *    - Select target Player A's Core Hound
 *    - Assert: Player A's Core Hound attack is 1 (changed from 13)
 * 4. blessing-of-might-cast:
 *    - Player A uses Blessing of Might
 *    - Select target Player A's Core Hound
 *    - Assert: Player A's Core Hound attack is 4 (1 + 3, Humility's SET effect can be overridden by buffs)
 * 5. core-hound-attack:
 *    - Player A's Core Hound attacks Player B's hero
 *    - Assert: Player B's hero health is 26 (30 - 4)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { HumilityModel } from "./index";
import { BlessingOfKingsModel } from "../blessing-of-kings";
import { BlessingOfMightModel } from "../blessing-of-might";
import { CoreHoundModel } from "../../neutral/core-hound";
import { boot } from "../../boot";

describe('humility', () => {
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
                            cards: [new BlessingOfKingsModel(), new HumilityModel(), new BlessingOfMightModel()]
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
    const heroB = game.child.playerB.child.hero;
    
    const cardC = boardA.child.cards.find(item => item instanceof CoreHoundModel);
    const cardD = handA.child.cards.find(item => item instanceof BlessingOfKingsModel);
    const cardE = handA.child.cards.find(item => item instanceof HumilityModel);
    const cardF = handA.child.cards.find(item => item instanceof BlessingOfMightModel);
    if (!cardC || !cardD || !cardE || !cardF) throw new Error();

    test('blessing-of-kings-cast', async () => {
        // Player A uses Blessing of Kings on Core Hound
        let promise = cardD.play();
        await CommonUtil.sleep();
        playerA.controller.set(cardC);
        await promise;

        // Assert: Player A's Core Hound attack is 13 (9 + 4)
        expect(cardC.child.attack.state.current).toBe(13);
        // Assert: Player A's Core Hound health is 9 (5 + 4)
        expect(cardC.child.health.state.current).toBe(9);
    });

    test('humility-cast', async () => {
        // Player A uses Humility on Core Hound
        let promise = cardE.play();
        await CommonUtil.sleep();
        playerA.controller.set(cardC);
        await promise;

        // Assert: Player A's Core Hound attack is 1 (changed from 13)
        expect(cardC.child.attack.state.current).toBe(1);
        // Assert: Player A's Core Hound health is 9 (unchanged, Humility only affects attack)
        expect(cardC.child.health.state.current).toBe(9);
    });

    test('blessing-of-might-cast', async () => {
        // Player A uses Blessing of Might on Core Hound
        let promise = cardF.play();
        await CommonUtil.sleep();
        playerA.controller.set(cardC);
        await promise;

        // Assert: Player A's Core Hound attack is 4 (1 + 3, Humility's SET effect can be overridden by buffs)
        expect(cardC.child.attack.state.current).toBe(4);
    });

    test('core-hound-attack', async () => {
        // Player A's Core Hound attacks Player B's hero
        let promise = cardC.child.action.run();
        await CommonUtil.sleep();
        playerA.controller.set(heroB);
        await promise;

        // Assert: Player B's hero health is 26 (30 - 4)
        expect(heroB.child.health.state.current).toBe(26);

    });
});

