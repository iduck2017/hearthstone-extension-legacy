/**
 * Test cases for Voodoo Doctor
 * 
 * 1. wisp-attack-shieldbearer: Player A's Wisp attacks Player B's hero
 * 2. voodoo-doctor-battlecry: Player A plays Voodoo Doctor and heals Player B's hero
 */

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, AnimeUtil, ManaModel } from "hearthstone-core";

import { boot } from "../boot";
import { WispModel } from "../wisp";
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
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    const playerB = game.child.playerB;
    const playerA = game.child.playerA;
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    if (!roleC || !roleD) throw new Error();

    test('wisp-attack-shieldbearer', async () => {
        expect(boardA.child.cards.length).toBe(1);
        
        // Wisp attacks Shieldbearer
        let promise = roleC.child.action.run();
        await AnimeUtil.sleep();
        expect(playerA.child.controller.current).toBeDefined();
        expect(playerA.child.controller.current?.options).toContain(roleB);
        expect(playerA.child.controller.current?.options.length).toBe(1);
        playerA.child.controller.set(roleB);
        await promise;
        
        expect(roleB.child.health.state.current).toBe(29);
        expect(roleB.child.health.state.damage).toBe(1);
    })

    test('voodoo-doctor-battlecry', async () => {
        // Play Voodoo Doctor
        let promise = cardD.play();
        await AnimeUtil.sleep();
        expect(playerA.child.controller.current?.options).toContain(0);
        playerA.child.controller.set(0);
        await AnimeUtil.sleep();
        
        expect(playerA.child.controller.current?.options).toContain(roleA);
        expect(playerA.child.controller.current?.options).toContain(roleB);
        expect(playerA.child.controller.current?.options).toContain(roleC);
        expect(playerA.child.controller.current?.options.length).toBe(3);
        playerA.child.controller.set(roleB);
        await promise;
        
        expect(roleB.child.health.state.current).toBe(30);
        expect(roleB.child.health.state.damage).toBe(0);
    })
}) 