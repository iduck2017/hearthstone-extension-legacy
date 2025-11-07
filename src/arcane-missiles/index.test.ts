/**
 * Test cases for Arcane Missiles
 * 
 * 1. arcane-missiles-cast: Player A plays Arcane Missiles and deals 3 damage randomly split among all enemies
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel } from "hearthstone-core";
import { ArcaneMissilesModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";


describe('arcane-missiles', () => {
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
                        child: { cards: [new ArcaneMissilesModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [] }
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
    const roleB = playerB.child.hero.child.role;
    const cardD = handA.child.cards.find(item => item instanceof ArcaneMissilesModel);
    if (!cardD) throw new Error();

    test('arcane-missiles-cast', async () => {
        expect(roleB.child.health.state.current).toBe(30);
        expect(playerA.child.mana.state.current).toBe(10);
        
        // Play Arcane Missiles - no target selection needed
        await cardD.play();

        expect(playerA.child.mana.state.current).toBe(9);
        // Hero should take exactly 3 damage (since no other enemies)
        expect(roleB.child.health.state.current).toBe(27);
        expect(roleB.child.health.state.damage).toBe(3);
    })
})