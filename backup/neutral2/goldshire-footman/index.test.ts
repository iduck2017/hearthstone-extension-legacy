/**
 * Test cases for Goldshire Footman
 * 
 * 1. wisp-attack-goldshire-footman: Player A's Wisp can only attack Player B's Goldshire Footman due to taunt
 */

import { GameModel, PlayerModel, MageModel, BoardModel, ManaModel } from "hearthstone-core";
import { GoldshireFootmanModel } from ".";
import { WispModel } from '../wisp';
import { boot } from '../../boot';



describe('goldshire-footman', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new WispModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new GoldshireFootmanModel()] }
                    })
                }
            })
        }
    });
    boot(game);
    const playerA = game.child.playerA;
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const playerB = game.child.playerB;
    const cardC = boardA.child.cards.find((item: any) => item instanceof WispModel);
    const cardD = boardB.child.cards.find((item: any) => item instanceof GoldshireFootmanModel);
    const heroB = playerB.child.hero;
    if (!cardC || !cardD) throw new Error();

    test('wisp-attack-goldshire-footman', async () => {
        // Initial state verification
        expect(cardC.child.action.state.current).toBe(1); // Wisp has action point
        expect(cardD.child.taunt.state.actived).toBe(true);
        const promise = cardC.child.action.run();
        const selector = playerA.controller.current;
        expect(selector?.options).toContain(cardD);
        expect(selector?.options).not.toContain(heroB);
        playerA.controller.set(cardD);
        await promise;
        expect(cardD.child.health.state.current).toBe(1);
        expect(cardD.child.health.state.maximum).toBe(2);
        expect(cardD.child.health.state.damage).toBe(1);
        expect(cardD.child.health.state.maximum).toBe(2);
    })
}) 