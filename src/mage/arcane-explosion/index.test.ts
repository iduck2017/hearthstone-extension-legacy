/**
 * Test cases for Arcane Explosion
 * 
 * 1. arcane-explosion-cast: Player A plays Arcane Explosion and deals 1 damage to all enemy minions
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel } from "hearthstone-core";
import { ArcaneExplosionModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { GoldshireFootmanModel } from "../../neutral/goldshire-footman";
import { boot } from "../../boot";

describe('arcane-explosion', () => {
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
                        child: { cards: [new ArcaneExplosionModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new WispModel(), new GoldshireFootmanModel()] }
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
    const cardD = handA.child.cards.find(item => item instanceof ArcaneExplosionModel);
    const cardE = boardB.child.cards.find(item => item instanceof WispModel);
    const cardF = boardB.child.cards.find(item => item instanceof GoldshireFootmanModel);
    if (!cardD || !cardE || !cardF) throw new Error();

    test('arcane-explosion-cast', async () => {
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(1);
        expect(cardE.child.health.state.current).toBe(1); // Wisp: 1 health
        expect(cardF.child.health.state.current).toBe(2); // Goldshire Footman: 2 health
        expect(boardB.child.cards.length).toBe(2);

        // Play Arcane Explosion - no target selection needed
        await cardD.play();

        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 cost
        expect(handA.child.cards.length).toBe(0);
        
        // All enemy minions should take 1 damage
        expect(cardE.child.health.state.current).toBe(0); // Wisp: 1 -> 0 (dies)
        expect(cardF.child.health.state.current).toBe(1); // Goldshire Footman: 2 -> 1

        // Dead minion should be removed from board
        expect(boardB.child.cards.length).toBe(1);
        expect(boardB.child.cards[0]).toBe(cardF);
    })

})
