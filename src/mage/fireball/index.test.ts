/**
 * Test cases for Fireball
 * 
 * 1. fireball-damage: Player A plays Fireball and deals 6 damage to Player B's hero
 * 2. fireball-minion: Player A plays Fireball and deals 6 damage to a minion
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel } from "hearthstone-core";
import { FireballModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";



describe('fireball', () => {
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
                        child: { cards: [new FireballModel()] }
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
    
    const handA = game.child.playerA.child.hand;
    const boardB = game.child.playerB.child.board;
    const cardD = handA.child.cards.find(item => item instanceof FireballModel);
    const cardC = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardD || !cardC) throw new Error();
    const heroA = game.child.playerA.child.hero;
    const heroB = game.child.playerB.child.hero;

    test('fireball-cast', async () => {
        expect(cardC.child.health.state.current).toBe(1);
        
        // Play Fireball targeting enemy hero
        let promise = cardD.play();
        expect(game.child.playerA.child.controller.current?.options).toContain(heroA);
        expect(game.child.playerA.child.controller.current?.options).toContain(heroB);
        expect(game.child.playerA.child.controller.current?.options).toContain(cardC);
        game.child.playerA.child.controller.set(cardC);
        await promise;
        
        // Hero should take 6 damage
        expect(cardC.child.health.state.current).toBe(-5);
        expect(cardC.child.health.state.damage).toBe(6);
        expect(cardC.child.dispose.status).toBe(true);
        expect(cardC.child.dispose.refer.source).toBe(cardD);
    })

})
