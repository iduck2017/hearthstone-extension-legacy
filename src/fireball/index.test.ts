/**
 * Test cases for Fireball
 * 
 * 1. fireball-damage: Player A plays Fireball and deals 6 damage to Player B's hero
 * 2. fireball-minion: Player A plays Fireball and deals 6 damage to a minion
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, SelectUtil, ManaModel } from "hearthstone-core";
import { FireballModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";



describe('fireball', () => {
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
                        child: { spells: [new FireballModel()] }
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
                        child: { spells: [] }
                    })
                }
            })
        }
    });
    boot(game);
    
    const handA = game.child.playerA.child.hand;
    const boardB = game.child.playerB.child.board;
    const cardD = handA.child.spells.find(item => item instanceof FireballModel);
    const cardC = boardB.child.minions.find(item => item instanceof WispModel);
    const roleA = game.child.playerA.child.hero.child.role;
    const roleB = game.child.playerB.child.hero.child.role;
    const roleC = cardC?.child.role;
    if (!cardD || !roleC) throw new Error();

    test('fireball-cast', async () => {
        expect(roleC.child.health.state.current).toBe(1);
        
        // Play Fireball targeting enemy hero
        let promise = cardD.play();
        expect(SelectUtil.current?.options).toContain(roleA);
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options).toContain(roleC);
        SelectUtil.set(roleC);
        await promise;
        
        // Hero should take 6 damage
        expect(roleC.child.health.state.current).toBe(-5);
        expect(roleC.child.health.state.damage).toBe(6);
        expect(cardC.child.dispose.status).toBe(true);
        expect(cardC.child.dispose.refer.source).toBe(cardD);
    })

})
