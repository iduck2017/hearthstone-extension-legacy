/**
 * Test cases for Grommash Hellscream
 * 
 * 1. initial-state:
 *    - Player A has Grommash Hellscream in hand
 *    - Player B has Wisp (1/1) on board
 *    - Player B hero health 30
 * 2. grommash-hellscream-play:
 *    - Player A summons Grommash Hellscream
 *    - Assert: Grommash Hellscream is on Player A's board
 *    - Assert: Grommash Hellscream has Charge
 *    - Assert: Grommash Hellscream can attack immediately
 *    - Assert: Grommash Hellscream attack is 4 (base)
 * 3. grommash-hellscream-attack:
 *    - Grommash Hellscream attacks Player B's Wisp
 *    - Assert: Grommash Hellscream can target enemy hero
 *    - Assert: Grommash Hellscream can target enemy minion
 *    - Assert: Wisp is destroyed
 *    - Assert: Grommash Hellscream health is 8 (9 - 1)
 *    - Assert: Grommash Hellscream attack is 10 (4 + 6, because damaged)
 * 4. grommash-hellscream-attack:
 *    - Turn switches to Player B, then back to Player A
 *    - Grommash Hellscream attacks Player B's hero
 *    - Assert: Player B's hero health is 20 (30 - 10)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { GrommashHellscreamModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";

describe('grommash-hellscream', () => {
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
                            cards: [new GrommashHellscreamModel()]
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
    const heroB = playerB.child.hero;
    
    const cardC = handA.child.cards.find(item => item instanceof GrommashHellscreamModel);
    if (!cardC) throw new Error();

    test('grommash-hellscream-play', async () => {
        // Player A summons Grommash Hellscream
        let promise = cardC.play();
        await CommonUtil.sleep();
        playerA.controller.set(0);
        await promise;

        // Assert: Grommash Hellscream is on Player A's board
        expect(boardA.child.cards.length).toBe(1);
        expect(boardA.child.cards[0]).toBe(cardC);
        // Assert: Grommash Hellscream has Charge
        expect(cardC.child.charge.state.isEnabled).toBe(true);
        // Assert: Grommash Hellscream can attack immediately
        expect(cardC.child.action.state.isReady).toBe(true);
        // Assert: Grommash Hellscream attack is 4 (base)
        expect(cardC.child.attack.state.current).toBe(4);
    });

    test('grommash-hellscream-attack', async () => {
        const cardD = playerB.child.board.child.cards.find(item => item instanceof WispModel);
        if (!cardD) throw new Error();

        // Grommash Hellscream attacks Player B's Wisp
        let promise = cardC.child.action.run();
        await CommonUtil.sleep();
        
        // Assert: Grommash Hellscream can target enemy hero
        expect(playerA.controller.current?.options).toContain(heroB);
        // Assert: Grommash Hellscream can target enemy minion
        expect(playerA.controller.current?.options).toContain(cardD);
        
        playerA.controller.set(cardD);
        await promise;

        // Assert: Wisp is destroyed
        expect(cardD.child.dispose.state.isActived).toBe(true);
        // Assert: Grommash Hellscream health is 8 (9 - 1)
        expect(cardC.child.health.state.current).toBe(8);
        // Assert: Grommash Hellscream attack is 10 (4 + 6, because damaged)
        expect(cardC.child.attack.state.current).toBe(10);
    });

    test('grommash-hellscream-attack', async () => {
        // Turn switches to Player B, then back to Player A
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerA);

        // Grommash Hellscream attacks Player B's hero
        let promise = cardC.child.action.run();
        await CommonUtil.sleep();
        playerA.controller.set(heroB);
        await promise;

        // Assert: Player B's hero health is 20 (30 - 10)
        expect(heroB.child.health.state.current).toBe(20);
    });
});

