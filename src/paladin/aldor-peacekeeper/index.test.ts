/**
 * Test cases for Aldor Peacekeeper
 * 
 * 1. initial-state:
 *    - Player A has Aldor Peacekeeper in hand
 *    - Player A has Blessing of Might in hand
 *    - Player B has Core Hound (9/5) on board
 * 2. aldor-peacekeeper-play:
 *    - Player A plays Aldor Peacekeeper
 *    - Select position 0
 *    - Select target Player B's Core Hound
 *    - Assert: Player B's Core Hound attack is 1 (changed from 9)
 * 3. blessing-of-might-cast:
 *    - Player A uses Blessing of Might
 *    - Select target Player B's Core Hound
 *    - Assert: Player B's Core Hound attack is 4 (1 + 3)
 * 4. core-hound-attack:
 *    - Turn switches to Player B
 *    - Player B's Core Hound attacks Player A's hero
 *    - Assert: Player A's hero health is 26 (30 - 4)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { AldorPeacekeeperModel } from "./index";
import { BlessingOfMightModel } from "../blessing-of-might";
import { CoreHoundModel } from "../../neutral/core-hound";
import { boot } from "../../boot";

describe('aldor-peacekeeper', () => {
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
                            cards: [new AldorPeacekeeperModel(), new BlessingOfMightModel()]
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
    const heroA = playerA.child.hero;
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    
    const cardC = boardB.child.cards.find(item => item instanceof CoreHoundModel);
    const cardD = handA.child.cards.find(item => item instanceof AldorPeacekeeperModel);
    const cardE = handA.child.cards.find(item => item instanceof BlessingOfMightModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    test('aldor-peacekeeper-play', async () => {
        // Player A plays Aldor Peacekeeper
        let promise = cardD.play();
        await CommonUtil.sleep();
        playerA.controller.set(0); // Select position 0
        
        await CommonUtil.sleep();
        // Choose target for battlecry
        expect(playerA.controller.current?.options).toContain(cardC); // Can target Player B's Core Hound
        playerA.controller.set(cardC); // Target Player B's Core Hound
        await promise;

        // Assert: Player B's Core Hound attack is 1 (changed from 9)
        expect(cardC.child.attack.state.current).toBe(1);
    });

    test('blessing-of-might-cast', async () => {
        // Player A uses Blessing of Might
        let promise = cardE.play();
        await CommonUtil.sleep();
        
        // Select target Player B's Core Hound
        playerA.controller.set(cardC);
        await promise;

        // Assert: Player B's Core Hound attack is 4 (1 + 3)
        expect(cardC.child.attack.state.current).toBe(4);
    });

    test('core-hound-attack', async () => {
        // Turn switches to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Player B's Core Hound attacks Player A's hero
        let promise = cardC.child.action.run();
        await CommonUtil.sleep();
        playerB.controller.set(heroA);
        await promise;

        // Assert: Player A's hero health is 26 (30 - 4)
        expect(heroA.child.health.state.current).toBe(26);
    });
});

