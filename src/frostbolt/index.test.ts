/**
 * Test cases for Frostbolt
 * 
 * 1. frostbolt-cast: Player A plays Frostbolt on target, deals 3 damage and freezes it
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, SelectUtil } from "hearthstone-core";
import { FrostboltModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";



describe('frostbolt', () => {
    const game = new GameModel(() => ({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [] }
                    })),
                    hand: new HandModel(() => ({
                        child: { spells: [new FrostboltModel()] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new WispModel()] }
                    })),
                    hand: new HandModel(() => ({
                        child: { spells: [] }
                    }))
                }
            }))
        }
    }));
    boot(game);
    
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const handA = playerA.child.hand;
    const boardB = playerB.child.board;
    const cardC = boardB.child.minions.find(item => item instanceof WispModel);
    const cardD = handA.child.spells.find(item => item instanceof FrostboltModel);
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC?.child.role;
    if (!cardD || !roleC) throw new Error();
    const turn = game.child.turn;

    test('frostbolt-cast', async () => {
        // Target is not frozen initially and has full health
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.spells.length).toBe(1);
        expect(roleC.child.feats.child.frozen.state.isActive).toBeFalsy();
        expect(roleC.child.health.state.current).toBe(1);

        // Play Frostbolt targeting enemy minion
        let promise = cardD.play();
        expect(SelectUtil.current?.options).toContain(roleA);
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options).toContain(roleC);
        SelectUtil.set(roleC);
        await promise;
        
        // Target should take 3 damage and be frozen
        expect(playerA.child.mana.state.current).toBe(8);
        expect(roleC.child.health.state.current).toBe(-2);
        expect(roleC.child.health.state.damage).toBe(3);
        expect(roleC.child.feats.child.frozen.state.isActive).toBe(true);
        expect(handA.child.spells.length).toBe(0);
        
        // Check turn progression and frozen state persists
        turn.next();
        expect(turn.refer.current).toBe(playerB);
        expect(roleC.child.feats.child.frozen.state.isActive).toBe(true);
        expect(roleC.child.action.status).toBe(false);
        
    })
}) 