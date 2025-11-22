/*
 * Test scenarios for Bloodsail Corsair:
 * 1. bloodsail-corsair-battlecry: Player A plays Bloodsail Corsair, removes 1 durability from Player B's weapon
 */

import { GameModel, HandModel, MageModel, PlayerModel, AnimeUtil, ManaModel, WarriorModel, BoardModel } from "hearthstone-core";
import { BloodsailCorsairModel } from ".";
import { boot } from '../../boot';
import { FieryWarAxeModel } from "../../warrior/fiery-war-axe";

describe('bloodsail-corsair', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    hand: new HandModel({
                        child: { cards: [new BloodsailCorsairModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new WarriorModel(),
                    board: new BoardModel({
                        child: { weapon: new FieryWarAxeModel() }
                    })
                }
            })
        }
    });
    boot(game);
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const handA = playerA.child.hand;
    const cardC = handA.child.cards.find((item: any) => item instanceof BloodsailCorsairModel);
    const heroB = playerB.child.hero;
    const cardD = playerB.child.board.child.weapon;
    if (!cardC || !cardD) throw new Error();

    test('bloodsail-corsair-battlecry', async () => {
        // Verify initial weapon durability
        expect(cardD.child.action.state.current).toBe(2);
        expect(cardD.child.action.state.maximum).toBe(2);
        expect(cardD.child.action.state.origin).toBe(2);
        expect(cardD.child.action.state.consume).toBe(0);
        
        // Player A plays Bloodsail Corsair
        let promise = cardC.play();
        await AnimeUtil.sleep();
        expect(playerA.controller.current?.options).toContain(0);
        playerA.controller.set(0);
        await promise;
        
        // Verify minion is played
        expect(cardC.child.attack.state.current).toBe(1);
        expect(cardC.child.health.state.current).toBe(2);
        
        // Verify weapon durability is reduced by 1
        expect(cardD.child.action.state.origin).toBe(2);
        expect(cardD.child.action.state.maximum).toBe(2);
        expect(cardD.child.action.state.current).toBe(1);
        expect(cardD.child.action.state.consume).toBe(1);
    });
}); 