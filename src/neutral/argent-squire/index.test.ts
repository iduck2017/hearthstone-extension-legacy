/**
 * Test cases for Argent Squire
 * 
 * 1. argent-squire-attack: Player A's Argent Squire attacks Player B's Argent Squire, Both squires survive.
 * 2. argent-squire-die: Player B's Argent Squire attacks Player A's Argent Squire, both squires die.
 */

import { GameModel, PlayerModel, MageModel, BoardModel, ManaModel } from "hearthstone-core";
import { ArgentSquireModel } from "./index";
import { boot } from '../../boot';


describe('argent-squire', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new ArgentSquireModel()] }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new ArgentSquireModel()] }
                    })
                }
            })
        }
    });
    boot(game);
    
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const cardC = boardA.child.cards.find(item => item instanceof ArgentSquireModel);
    const cardD = boardB.child.cards.find(item => item instanceof ArgentSquireModel);
    if (!cardC || !cardD) throw new Error();
    const turn = game.child.turn;

    test('argent-squire-attack', async () => {
        // First attack: both squires attack each other
        // Divine Shield blocks the damage, so no health is lost
        expect(cardC.child.health.state.current).toBe(1);
        expect(cardD.child.health.state.current).toBe(1);
        expect(cardC.child.divineShield.state.isEnabled).toBe(true);
        expect(cardD.child.divineShield.state.isEnabled).toBe(true);
        
        const promise = cardC.child.action.run();
        const selector = playerA.controller.current;
        expect(selector?.options).toContain(cardD);
        playerA.controller.set(cardD);
        await promise;

        expect(cardC.child.health.state.current).toBe(1);
        expect(cardD.child.health.state.current).toBe(1);
        
        expect(cardC.child.divineShield.state.isEnabled).toBe(false);
        expect(cardD.child.divineShield.state.isEnabled).toBe(false);

        expect(cardC.child.dispose.state.isActived).toBe(false);
        expect(cardD.child.dispose.state.isActived).toBe(false);
    })

    test('argent-squire-die', async () => {
        turn.next();
        
        const promise = cardD.child.action.run();
        expect(game.child.playerB.controller.current?.options).toContain(cardC);
        game.child.playerB.controller.set(cardC);
        await promise;

        expect(cardC.child.health.state.current).toBe(0);
        expect(cardD.child.health.state.current).toBe(0);
        expect(cardC.child.dispose.state.isActived).toBe(true);
        expect(cardD.child.dispose.state.isActived).toBe(true);

        expect(boardA.child.cards.length).toBe(0);
        expect(boardB.child.cards.length).toBe(0);
    })
})