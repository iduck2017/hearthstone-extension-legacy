/**
 * Test cases for Stonetusk Boar
 * 
 * 1. initial-state:
 *    - Player A has Stonetusk Boar in hand
 *    - Player B has Wisp (1/1) on board
 *    - Player B hero health 30
 * 2. stonetusk-boar-play:
 *    - Player A summons Stonetusk Boar
 *    - Assert: Stonetusk Boar has Charge
 *    - Assert: Stonetusk Boar can attack immediately
 * 3. stonetusk-boar-attack:
 *    - Stonetusk Boar attacks Player B's hero
 *    - Assert: Can target enemy hero
 *    - Assert: Can target enemy minion
 *    - Assert: Player B's hero health is 29
 *    - Assert: Stonetusk Boar's action is consumed
 */

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, ManaModel } from "hearthstone-core";
import { StonetuskBoarModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../../boot";


describe('stonetusk-boar', () => {
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
                        child: { cards: [new StonetuskBoarModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new WispModel()] }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
                    })
                }
            })
        }
    });
    boot(game);
    
    const playerA = game.child.playerA;
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof StonetuskBoarModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    const heroB = game.child.playerB.child.hero;
    if (!cardC || !cardD) throw new Error();

    // initial-state:
    // - Player A has Stonetusk Boar in hand
    // - Player B has Wisp (1/1) on board
    // - Player B hero health 30

    test('stonetusk-boar-play', async () => {
        // Player A summons Stonetusk Boar
        let promise = cardC.play();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Assert: Stonetusk Boar has Charge
        expect(cardC.child.charge.state.isEnabled).toBe(true);
        
        // Assert: Stonetusk Boar can attack immediately
        expect(cardC.child.action.state.isReady).toBe(true);
    });

    test('stonetusk-boar-attack', async () => {
        // Stonetusk Boar attacks Player B's hero
        let promise = cardC.child.action.run();
        
        // Assert: Can target enemy hero
        expect(playerA.controller.current?.options).toContain(heroB);
        
        // Assert: Can target enemy minion
        expect(playerA.controller.current?.options).toContain(cardD);
        
        playerA.controller.set(heroB); // Target Player B's hero
        await promise;

        // Assert: Player B's hero health is 29
        expect(heroB.child.health.state.current).toBe(29);
        
        // Assert: Stonetusk Boar's action is consumed
        expect(cardC.child.action.state.current).toBe(0);
    });
}) 