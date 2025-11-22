/**
 * Test cases for Leper Gnome
 * 
 * 1. leper-gnome-deathrattle: Player A's Leper Gnome attacks Player B's Wisp, both die, Player B loses 2 health
 */

import { GameModel, BoardModel, MageModel, AnimeUtil, ManaModel, PlayerModel } from "hearthstone-core";
import { LeperGnomeModel } from ".";
import { WispModel } from '../../neutral/wisp';
import { boot } from '../../boot';


describe('leper-gnome', () => {
    const game = boot(new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new LeperGnomeModel()] 
                        }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new WispModel()] }
                    }),
                }
            }),
        }
    }));
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const cardC = boardA.child.cards.find(item => item instanceof LeperGnomeModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    const heroB = playerB.child.hero;
    if (!cardC || !cardD) throw new Error();

    test('leper-gnome-deathrattle', async () => {
        expect(boardA.child.cards.length).toBe(1);
        expect(boardB.child.cards.length).toBe(1);
        expect(cardC.child.attack.state.current).toBe(2);
        expect(cardC.child.health.state.current).toBe(1);
        expect(cardD.child.attack.state.current).toBe(1);
        expect(cardD.child.health.state.current).toBe(1);
        expect(heroB.child.health.state.current).toBe(30);
        
        // attack
        let promise = cardC.child.action.run();
        await AnimeUtil.sleep();
        expect(playerA.controller.current?.options).toContain(cardD);
        expect(playerA.controller.current?.options.length).toBe(2);
        playerA.controller.set(cardD);
        await promise;
        
        expect(boardA.child.cards.length).toBe(0);
        expect(boardB.child.cards.length).toBe(0);
        expect(heroB.child.health.state.current).toBe(28);
        expect(heroB.child.health.state.damage).toBe(2);
    })
})
