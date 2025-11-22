/*
 * Test scenarios for Bloodmage Thalnos:
 * 1. Player A uses Bloodmage Thalnos to attack wisp, both die, Player A draws a card
 */

import { GameModel, BoardModel, DeckModel, HandModel, MageModel, PlayerModel, AnimeUtil, ManaModel } from "hearthstone-core";
import { BloodmageThalnosModel } from ".";
import { FireballModel } from "../../../backup/mage/fireball";
import { WispModel } from "../wisp";
import { boot } from "../../boot";

describe('bloodmage-thalnos', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    hand: new HandModel({
                        child: { cards: [new FireballModel()] }
                    }),
                    board: new BoardModel({
                        child: { cards: [new BloodmageThalnosModel()] }
                    }),
                    deck: new DeckModel({
                        child: { cards: [new WispModel()] }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new WispModel()] }
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
    const cardC = boardA.child.cards.find(item => item instanceof BloodmageThalnosModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    const cardE = handA.child.cards.find(item => item instanceof FireballModel);
    const heroB = playerB.child.hero;
    if (!cardC || !cardD || !cardE) throw new Error();

    test('fireball-cast', async () => {
        const promise = cardE.play();
        expect(playerA.controller.current?.options).toContain(heroB);
        expect(playerA.controller.current?.options).toContain(cardD);
        expect(playerA.controller.current?.options).toContain(cardC);
        playerA.controller.set(heroB);
        await promise;
        expect(heroB.child.health.state.current).toBe(23)
        expect(heroB.child.health.state.damage).toBe(7)
    })

    test('bloodmage-thalnos-attack', async () => {
        // Verify initial state
        expect(boardA.child.cards.length).toBe(1);
        expect(boardB.child.cards.length).toBe(1);
        expect(deckA.child.cards.length).toBe(1);
        expect(handA.child.cards.length).toBe(0);
        expect(cardC.child.attack.state.current).toBe(1);
        expect(cardC.child.health.state.current).toBe(1);
        expect(cardD.child.attack.state.current).toBe(1);
        expect(cardD.child.health.state.current).toBe(1);
        
        // Player A uses Bloodmage Thalnos to attack wisp
        let promise = cardC.child.action.run();
        await AnimeUtil.sleep();
        expect(playerA.controller.current?.options).toContain(cardD);
        playerA.controller.set(cardD);
        await promise;
        
        // Verify both minions die
        expect(cardC.child.dispose.status).toBe(true);
        expect(cardD.child.dispose.status).toBe(true);
        expect(boardA.child.cards.length).toBe(0);
        expect(boardB.child.cards.length).toBe(0);
        
        // Verify deathrattle triggers and draws a card
        expect(deckA.child.cards.length).toBe(0);
        expect(handA.child.cards.length).toBe(1);
    });
}); 