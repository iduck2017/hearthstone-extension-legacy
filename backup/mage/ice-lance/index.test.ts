/**
 * Test cases for Ice Lance
 * 
 * 1. ice-lance-cast: Player A plays Ice Lance on unfrozen target, freezes it and checks mana cost
 * 2. ice-lance-cast: Player B plays Ice Lance on already frozen target, deals 4 damage
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel } from "hearthstone-core";
import { IceLanceModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";



describe('ice-lance', () => {
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
                        child: { cards: [new IceLanceModel()] }
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
                        child: { cards: [new IceLanceModel()] }
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
    const boardB = playerB.child.board;
    const cardC = boardB.child.cards.find(item => item instanceof WispModel);
    const cardD = handA.child.cards.find(item => item instanceof IceLanceModel);
    const cardE = handB.child.cards.find(item => item instanceof IceLanceModel);
    if (!cardD || !cardC || !cardE) throw new Error();
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;
    const turn = game.child.turn;

    test('ice-lance-cast', async () => {
        // Target is not frozen initially
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(1);
        expect(cardC.child.frozen.state.actived).toBeFalsy();

        // Play Ice Lance targeting enemy minion
        let promise = cardD.play();
        const options1 = playerA.controller.current?.options;
        expect(options1).toContain(heroA);
        expect(options1).toContain(heroB);
        expect(options1).toContain(cardC);
        playerA.controller.set(cardC);
        await promise;
        
        // Target should be frozen
        expect(playerA.child.mana.state.current).toBe(9);
        expect(cardC.child.frozen.state.actived).toBe(true);
        turn.next();
        expect(turn.refer.current).toBe(playerB);
        expect(cardC.child.frozen.state.actived).toBe(true);
        
        expect(handA.child.cards.length).toBe(0);
        expect(cardC.child.action.status).toBeFalsy();
    })

    test('ice-lance-cast', async () => {
        expect(playerB.child.mana.state.current).toBe(10);
        expect(handB.child.cards.length).toBe(1);
        expect(cardC.child.frozen.state.actived).toBe(true);

        let promise = cardE.play();
        const options2 = playerB.controller.current?.options;
        expect(options2).toContain(heroA);
        expect(options2).toContain(heroB);
        expect(options2).toContain(cardC);
        playerB.controller.set(cardC);
        await promise;

        expect(playerB.child.mana.state.current).toBe(9);
        expect(handA.child.cards.length).toBe(0);
        expect(cardC.child.action.status).toBeFalsy();
        expect(cardC.child.health.state.current).toBe(-3);
        expect(cardC.child.dispose.status).toBe(true);
        expect(cardC.child.dispose.refer.source).toBe(cardE);
    })
}) 