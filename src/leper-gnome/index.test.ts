/**
 * Test cases for Leper Gnome
 * 
 * 1. leper-gnome-deathrattle: Player A's Leper Gnome attacks Player B's Wisp, both die, Player B loses 2 health
 */

import { GameModel, BoardModel, MageModel, AnimeUtil, ManaModel, PlayerModel } from "hearthstone-core";
import { LeperGnomeModel } from ".";
import { WispModel } from "../wisp";
import { boot } from "../boot";


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
                            minions: [new LeperGnomeModel()] 
                        }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [new WispModel()] }
                    }),
                }
            }),
        }
    }));
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const cardC = boardA.child.minions.find(item => item instanceof LeperGnomeModel);
    const cardD = boardB.child.minions.find(item => item instanceof WispModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    const roleB = playerB.child.hero.child.role;
    if (!roleC || !roleD) throw new Error();

    test('leper-gnome-deathrattle', async () => {
        expect(boardA.child.minions.length).toBe(1);
        expect(boardB.child.minions.length).toBe(1);
        expect(roleC.child.attack.state.current).toBe(2);
        expect(roleC.child.health.state.current).toBe(1);
        expect(roleD.child.attack.state.current).toBe(1);
        expect(roleD.child.health.state.current).toBe(1);
        expect(roleB.child.health.state.current).toBe(30);
        
        // attack
        let promise = roleC.child.action.run();
        await AnimeUtil.sleep();
        expect(playerA.child.controller.current?.options).toContain(roleD);
        expect(playerA.child.controller.current?.options.length).toBe(2);
        playerA.child.controller.set(roleD);
        await promise;
        
        expect(boardA.child.minions.length).toBe(0);
        expect(boardB.child.minions.length).toBe(0);
        expect(roleB.child.health.state.current).toBe(28);
        expect(roleB.child.health.state.damage).toBe(2);
    })
})
