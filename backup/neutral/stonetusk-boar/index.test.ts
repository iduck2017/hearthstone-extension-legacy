/**
 * Test cases for Stonetusk Boar
 * 
 * 1. stonetusk-boar-charge: Player A plays Stonetusk Boar and immediately attacks enemy hero
 */

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, AnimeUtil, ManaModel } from "hearthstone-core";
import { StonetuskBoarModel } from "./index";
import { WispModel } from "../../neutral/wisp";
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
    
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof StonetuskBoarModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    const heroB = game.child.playerB.child.hero;
    if (!cardC || !cardD) throw new Error();

    test('stonetusk-boar-charge', async () => {
        expect(boardA.child.cards.length).toBe(0);
        expect(boardB.child.cards.length).toBe(1);
        expect(heroB.child.health.state.current).toBe(30);
        
        // Play Stonetusk Boar
        let promise = cardC.play();
        await AnimeUtil.sleep();
        expect(game.child.playerA.child.controller.current?.options).toContain(0);
        game.child.playerA.child.controller.set(0);
        await promise;
        expect(boardA.child.cards.length).toBe(1);
        expect(cardC.child.attack.state.current).toBe(1);
        expect(cardC.child.health.state.current).toBe(1);
        expect(cardC.child.action.state.current).toBe(1);
        expect(cardC.child.action.status).toBe(true);
        
        // Boar directly attacks enemy hero
        promise = cardC.child.action.run();
        await AnimeUtil.sleep();
        expect(game.child.playerA.child.controller.current?.options).toContain(heroB);
        expect(game.child.playerA.child.controller.current?.options.length).toBe(2);
        game.child.playerA.child.controller.set(heroB);
        await promise;
        
        expect(cardC.child.action.state.current).toBe(0);
        expect(heroB.child.health.state.current).toBe(29);
        expect(heroB.child.health.state.damage).toBe(1);
    })
}) 