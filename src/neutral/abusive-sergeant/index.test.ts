/**
 * Test cases for Abusive Sergeant
 * 
 * 1. abusive-sergeant-play: Player A plays Abusive Sergeant without battlecry effect
 * 2. abusive-sergeant-battlecry: Player B plays Abusive Sergeant and uses battlecry to buff Player A's minion
 * 3. abusive-sergeant-buff-expire: Buff expires at turn end
 */

import { BoardModel, GameModel, HandModel, MageModel, ManaModel, PlayerModel, AnimeUtil } from "hearthstone-core";
import { AbusiveSergeantModel } from ".";
import { boot } from "../../boot";
import { WispModel } from "../../neutral/wisp";

describe('abusive-sergeant', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    hand: new HandModel({
                        child: { 
                            cards: [
                                new AbusiveSergeantModel(),
                                new WispModel()
                            ] 
                        }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    hand: new HandModel({
                        child: { 
                            cards: [
                                new AbusiveSergeantModel(),
                                new WispModel()
                            ] 
                        }
                    }),
                }
            }),
        }
    });
    boot(game);

    const turn = game.child.turn;
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const handB = game.child.playerB.child.hand;
    const cardC = handA.child.cards.find((item: any) => item instanceof AbusiveSergeantModel);
    const cardD = handA.child.cards.find((item: any) => item instanceof WispModel);
    const cardE = handB.child.cards.find((item: any) => item instanceof WispModel);
    const cardF = handB.child.cards.find((item: any) => item instanceof AbusiveSergeantModel);
    if (!cardC || !cardD || !cardE || !cardF) throw new Error();

    test('abusive-sergeant-play', async () => {
        expect(boardB.child.cards.length).toBe(0);
        expect(boardA.child.cards.length).toBe(0);

        let promise = cardC.play();
        await AnimeUtil.sleep();
        expect(game.child.playerA.child.controller.current).toBeDefined();
        expect(game.child.playerA.child.controller.current?.options).toContain(0);
        game.child.playerA.child.controller.set(0);
        await promise;
        await AnimeUtil.sleep();
        expect(game.child.playerA.child.controller.current).toBeUndefined();

        // Play both cards without battlecry effect
        expect(boardA.child.cards.length).toBe(1);
        promise = cardD.play();
        await AnimeUtil.sleep();
        expect(game.child.playerA.child.controller.current).toBeDefined();
        expect(game.child.playerA.child.controller.current?.options).toContain(1);
        game.child.playerA.child.controller.set(1);
        await promise;
        
        expect(boardA.child.cards.length).toBe(2);
        expect(cardC.child.attack.state.current).toBe(2);
        expect(cardD.child.attack.state.current).toBe(1);
        expect(cardC.child.attack.state.origin).toBe(2);
        expect(cardD.child.attack.state.origin).toBe(1);
    })

    test('abusive-sergeant-battlecry', async () => {
        turn.next();
        let promise = cardE.play();
        await AnimeUtil.sleep();
        expect(game.child.playerB.child.controller.current).toBeDefined();
        expect(game.child.playerB.child.controller.current?.options).toContain(0);
        game.child.playerB.child.controller.set(0);
        await promise;
        expect(boardB.child.cards.length).toBe(1);

        // Play Abusive Sergeant with battlecry effect
        promise = cardF.play();
        await AnimeUtil.sleep();
        expect(game.child.playerB.child.controller.current).toBeDefined();
        expect(game.child.playerB.child.controller.current?.options).toContain(0);
        expect(game.child.playerB.child.controller.current?.options.length).toBe(2);
        game.child.playerB.child.controller.set(0);
        await AnimeUtil.sleep();
        expect(game.child.playerB.child.controller.current).toBeDefined();
        expect(game.child.playerB.child.controller.current?.options).toContain(cardD);
        expect(game.child.playerB.child.controller.current?.options).toContain(cardE);
        expect(game.child.playerB.child.controller.current?.options).toContain(cardC);
        expect(game.child.playerB.child.controller.current?.options.length).toBe(3);
        game.child.playerB.child.controller.set(cardD);
        await promise;
        await AnimeUtil.sleep();

        expect(boardA.child.cards.length).toBe(2);
        expect(boardB.child.cards.length).toBe(2);
        expect(cardD.child.attack.state.current).toBe(3);
        expect(cardD.child.attack.state.origin).toBe(1);
        expect(cardE.child.attack.state.current).toBe(1);
    })

    test('abusive-sergeant-buff-expire', async () => {
        expect(cardD.child.attack.state.current).toBe(3);
        
        turn.next();
        expect(cardD.child.attack.state.current).toBe(1);
        expect(cardD.child.attack.state.origin).toBe(1);
    })
})
