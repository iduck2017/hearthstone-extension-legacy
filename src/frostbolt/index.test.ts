/**
 * Test cases for Frostbolt
 * 
 * 1. frostbolt-cast: Player A plays Frostbolt on target, deals 3 damage and freezes it
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel } from "hearthstone-core";
import { FrostboltModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";



describe('frostbolt', () => {
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
                        child: { cards: [new FrostboltModel()] }
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
    const playerB = game.child.playerB;
    const handA = playerA.child.hand;
    const boardB = playerB.child.board;
    const cardC = boardB.child.cards.find(item => item instanceof WispModel);
    const cardD = handA.child.cards.find(item => item instanceof FrostboltModel);
    if (!cardD || !cardC) throw new Error();
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;
    const turn = game.child.turn;

    test('frostbolt-cast', async () => {
        // Target is not frozen initially and has full health
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(1);
        expect(cardC.child.feats.child.frozen.state.isActive).toBeFalsy();
        expect(cardC.child.health.state.current).toBe(1);

        // Play Frostbolt targeting enemy minion
        let promise = cardD.play();
        expect(playerA.child.controller.current?.options).toContain(heroA);
        expect(playerA.child.controller.current?.options).toContain(heroB);
        expect(playerA.child.controller.current?.options).toContain(cardC);
        playerA.child.controller.set(cardC);
        await promise;
        
        // Target should take 3 damage and be frozen
        expect(playerA.child.mana.state.current).toBe(8);
        expect(cardC.child.health.state.current).toBe(-2);
        expect(cardC.child.health.state.damage).toBe(3);
        expect(cardC.child.feats.child.frozen.state.isActive).toBe(true);
        expect(handA.child.cards.length).toBe(0);
        
        // Check turn progression and frozen state persists
        turn.next();
        expect(turn.refer.current).toBe(playerB);
        expect(cardC.child.feats.child.frozen.state.isActive).toBe(true);
        expect(cardC.child.action.status).toBe(false);
        
    })
}) 