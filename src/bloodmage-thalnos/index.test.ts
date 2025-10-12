/*
 * Test scenarios for Bloodmage Thalnos:
 * 1. Player A uses Bloodmage Thalnos to attack wisp, both die, Player A draws a card
 */

import { GameModel, BoardModel, DeckModel, HandModel, MageModel, PlayerModel, AnimeUtil, SelectUtil, ManaModel } from "hearthstone-core";
import { BloodmageThalnosModel } from ".";
import { FireballModel } from "../fireball";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('bloodmage-thalnos', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    hand: new HandModel({
                        child: { spells: [new FireballModel()] }
                    }),
                    board: new BoardModel({
                        child: { minions: [new BloodmageThalnosModel()] }
                    }),
                    deck: new DeckModel({
                        child: { minions: [new WispModel()] }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [new WispModel()] }
                    })
                }
            })
        }
    });
    boot(game);
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const deckA = playerA.child.deck;
    const handA = playerA.child.hand;
    const cardC = boardA.child.minions.find(item => item instanceof BloodmageThalnosModel);
    const cardD = boardB.child.minions.find(item => item instanceof WispModel);
    const cardE = handA.child.spells.find(item => item instanceof FireballModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    const roleB = playerB.child.hero.child.role;
    if (!roleC || !roleD || !cardE) throw new Error();

    test('fireball-cast', async () => {
        const promise = cardE.play();
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options).toContain(roleD);
        expect(SelectUtil.current?.options).toContain(roleC);
        SelectUtil.set(roleB);
        await promise;
        expect(roleB.child.health.state.current).toBe(23)
        expect(roleB.child.health.state.damage).toBe(7)
    })

    test('bloodmage-thalnos-attack', async () => {
        // Verify initial state
        expect(boardA.child.minions.length).toBe(1);
        expect(boardB.child.minions.length).toBe(1);
        expect(deckA.child.minions.length).toBe(1);
        expect(handA.child.minions.length).toBe(0);
        expect(roleC.child.attack.state.current).toBe(1);
        expect(roleC.child.health.state.current).toBe(1);
        expect(roleD.child.attack.state.current).toBe(1);
        expect(roleD.child.health.state.current).toBe(1);
        
        // Player A uses Bloodmage Thalnos to attack wisp
        let promise = roleC.child.action.run();
        await AnimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleD);
        SelectUtil.set(roleD);
        await promise;
        
        // Verify both minions die
        expect(cardC.child.dispose.status).toBe(true);
        expect(cardD.child.dispose.status).toBe(true);
        expect(boardA.child.minions.length).toBe(0);
        expect(boardB.child.minions.length).toBe(0);
        
        // Verify deathrattle triggers and draws a card
        expect(deckA.child.minions.length).toBe(0);
        expect(handA.child.minions.length).toBe(1);
    });
}); 