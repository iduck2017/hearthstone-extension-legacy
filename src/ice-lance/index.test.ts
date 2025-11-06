/**
 * Test cases for Ice Lance
 * 
 * 1. ice-lance-cast: Player A plays Ice Lance on unfrozen target, freezes it and checks mana cost
 * 2. ice-lance-cast: Player B plays Ice Lance on already frozen target, deals 4 damage
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel } from "hearthstone-core";
import { IceLanceModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";



describe('ice-lance', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [] }
                    }),
                    hand: new HandModel({
                        child: { spells: [new IceLanceModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [new WispModel()] }
                    }),
                    hand: new HandModel({
                        child: { spells: [new IceLanceModel()] }
                    })
                }
            })
        }
    });
    boot(game);
    
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const handA = playerA.child.hand;
    const handB = playerB.child.hand;
    const boardB = playerB.child.board;
    const cardC = boardB.child.minions.find(item => item instanceof WispModel);
    const cardD = handA.child.spells.find(item => item instanceof IceLanceModel);
    const cardE = handB.child.spells.find(item => item instanceof IceLanceModel);
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC?.child.role;
    if (!cardD || !roleC || !cardE) throw new Error();
    const turn = game.child.turn;

    test('ice-lance-cast', async () => {
        // Target is not frozen initially
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.spells.length).toBe(1);
        expect(roleC.child.feats.child.frozen.state.isActive).toBeFalsy();

        // Play Ice Lance targeting enemy minion
        let promise = cardD.play();
        expect(playerA.child.controller.current?.options).toContain(roleA);
        expect(playerA.child.controller.current?.options).toContain(roleB);
        expect(playerA.child.controller.current?.options).toContain(roleC);
        playerA.child.controller.set(roleC);
        await promise;
        
        // Target should be frozen
        expect(playerA.child.mana.state.current).toBe(9);
        expect(roleC.child.feats.child.frozen.state.isActive).toBe(true);
        turn.next();
        expect(turn.refer.current).toBe(playerB);
        expect(roleC.child.feats.child.frozen.state.isActive).toBe(true);
        
        expect(handA.child.spells.length).toBe(0);
        expect(roleC.child.action.status).toBeFalsy();
    })

    test('ice-lance-cast', async () => {
        expect(playerB.child.mana.state.current).toBe(10);
        expect(handB.child.spells.length).toBe(1);
        expect(roleC.child.feats.child.frozen.state.isActive).toBe(true);

        let promise = cardE.play();
        expect(playerB.child.controller.current?.options).toContain(roleA);
        expect(playerB.child.controller.current?.options).toContain(roleB);
        expect(playerB.child.controller.current?.options).toContain(roleC);
        playerB.child.controller.set(roleC);
        await promise;

        expect(playerB.child.mana.state.current).toBe(9);
        expect(handA.child.spells.length).toBe(0);
        expect(roleC.child.action.status).toBeFalsy();
        expect(roleC.child.health.state.current).toBe(-3);
        expect(cardC.child.dispose.status).toBe(true);
        expect(cardC.child.dispose.refer.source).toBe(cardE);
    })
}) 