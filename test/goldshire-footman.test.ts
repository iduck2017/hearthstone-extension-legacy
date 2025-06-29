/**
 * Test cases for Goldshire Footman
 * 
 * Requirements:
 * 1. start: Both players have a wisp and footman on board respectively, turn starts
 * 2. attack: Wisp can only attack the footman due to taunt
 */

import { GameModel, PlayerModel, MageHeroModel, BoardModel, Selector, Utils } from "hearthstone-core";
import { GoldshireFootmanCardModel } from "../src/goldshire-footman";
import { WispCardModel } from "../src/wisp";
import { boot } from "./boot";

describe('goldshire-footman', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageHeroModel({}),
                    board: new BoardModel({
                        child: { cards: [new WispCardModel({})] }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageHeroModel({}),
                    board: new BoardModel({
                        child: { cards: [new GoldshireFootmanCardModel({})] }
                    })
                }
            })
        }
    })
    const root = boot(game);

    test('attack', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const playerB = game.child.playerB;
        
        const cardA = boardA.child.cards.find(item => item instanceof WispCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof GoldshireFootmanCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        
        // Initial state verification
        expect(roleA.state.action).toBe(1); // Wisp has action point
        expect(roleB.state.action).toBe(0); // Footman has no action point (not its turn)
        
        // Verify footman has taunt
        expect(roleB.state.isTaunt).toBe(true);
        
        // Wisp tries to attack - should only be able to target the footman due to taunt
        process.nextTick(() => {
            const selector = Selector.current;
            expect(selector).toBeDefined();
            if (!selector) return;
            
            // Due to taunt, wisp can only attack the footman, not the hero
            expect(selector.candidates.length).toBe(1);
            expect(selector.candidates).toContain(roleB);
            expect(selector.candidates).not.toContain(playerB.child.role);
            
            selector.set(roleB);
        });
        await roleA.prepareAttack();
        await Utils.sleep();
        
        // Verify attack results
        expect(roleA.state.action).toBe(0); // Action consumed
        expect(roleA.state).toMatchObject({
            damage: 1,          // Wisp took 1 damage from footman
            curHealth: 0,       // Wisp health reduced to 0
            maxHealth: 1,
        });
        expect(roleB.state).toMatchObject({
            damage: 1,          // Footman took 1 damage from wisp
            curHealth: 1,       // Footman health reduced to 1 (2 - 1)
            maxHealth: 2,
        });
    })
}) 