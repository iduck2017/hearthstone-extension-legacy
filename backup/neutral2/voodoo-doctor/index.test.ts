/**
 * Test cases for Voodoo Doctor
 * 
 * 1. wisp-attack-shieldbearer: Player A's Wisp attacks Player B's hero
 * 2. voodoo-doctor-battlecry: Player A plays Voodoo Doctor and heals Player B's hero
 */

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, AnimeUtil, ManaModel } from "hearthstone-core";

import { boot } from '../../boot';
import { WispModel } from '../wisp';
import { VoodooDoctorModel } from ".";

describe('voodoo-doctor', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel(),
                    mana: new ManaModel({ state: { origin: 10 }}),
                    board: new BoardModel({
                        child: { cards: [new WispModel()] }
                    }),
                    hand: new HandModel({
                        child: { cards: [new VoodooDoctorModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                }
            })
        }
    });
    boot(game)
    const turn = game.child.turn;
    const boardA = game.child.playerA.child.board;
    const handA = game.child.playerA.child.hand;
    const cardC = boardA.child.cards.find(item => item instanceof WispModel);
    const cardD = handA.child.cards.find(item => item instanceof VoodooDoctorModel);
    const playerB = game.child.playerB;
    const playerA = game.child.playerA;
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;
    if (!cardC || !cardD) throw new Error();

    test('wisp-attack-shieldbearer', async () => {
        expect(boardA.child.cards.length).toBe(1);
        
        // Wisp attacks Shieldbearer
        let promise = cardC.child.action.run();
        const selector = playerA.controller.current;
        expect(selector?.options).toContain(heroB);
        expect(selector?.options.length).toBe(1);
        playerA.controller.set(heroB);
        await promise;
        
        expect(heroB.child.health.state.current).toBe(29);
        expect(heroB.child.health.state.damage).toBe(1);
    })

    test('voodoo-doctor-battlecry', async () => {
        // Play Voodoo Doctor
        let promise = cardD.play();
        let selector = playerA.controller.current;
        expect(selector?.options).toContain(0);
        playerA.controller.set(0);
        await AnimeUtil.pause();
        selector = playerA.controller.current;
        expect(selector?.options).toContain(heroA);
        expect(selector?.options).toContain(heroB);
        expect(selector?.options).toContain(cardC);
        expect(selector?.options.length).toBe(3);
        playerA.controller.set(heroB);
        await promise;
        
        expect(heroB.child.health.state.current).toBe(30);
        expect(heroB.child.health.state.damage).toBe(0);
    })
}) 