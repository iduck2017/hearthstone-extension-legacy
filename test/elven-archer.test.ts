/**
 * Test cases for Elven Archer
 * 
 * Requirements:
 * 1. start: Player B has a wisp on board by default, Player A has an elven archer in hand
 * 2. battlecry: Player A uses Elven Archer to attack the wisp
 */

import { ElvenArcherCardModel } from "../src/elven-archer";
import { GameModel, PlayerModel, MageHeroModel, HandModel, BoardModel, Selector, RootModel } from "hearthstone-core";
import { WispCardModel } from "../src/wisp";
import { RouteUtil } from "set-piece";
import { boot } from "./boot";

describe('elven-archer', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageHeroModel({}),
                    hand: new HandModel({
                        child: { cards: [new ElvenArcherCardModel({})] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageHeroModel({}),
                    board: new BoardModel({
                        child: { cards: [new WispCardModel({})] }
                    })
                }
            })
        }
    })
    const root = boot(game);

    test('battlecry', async () => {
        const playerA = game.child.playerA;
        const playerB = game.child.playerB;
        const hand = game.child.playerA.child.hand;
        const board = game.child.playerB.child.board;
        const cardA = hand.child.cards.find(item => item instanceof ElvenArcherCardModel);
        const cardB = board.child.cards.find(item => item instanceof WispCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        
        // Initial state of the wisp
        let state = {
            attack: 1,
            health: 1,
            modAttack: 0,
            modHealth: 0,
            damage: 0,
            maxHealth: 1,
            curHealth: 1,
            curAttack: 1,
        }
        const role = cardB.child.role;
        expect(role.state).toMatchObject(state);
        
        // Use Elven Archer to deal 1 damage to the wisp
        process.nextTick(() => {
            const selector = Selector.current;
            expect(selector?.candidates.length).toBe(3);
            expect(selector?.candidates).toContain(playerA.child.role);
            expect(selector?.candidates).toContain(playerB.child.role);
            expect(selector?.candidates).toContain(role);
            selector?.set(role);
        })
        await cardA.preparePlay();
        
        // State after battlecry: wisp takes 1 damage
        expect(role.state).toMatchObject({
            ...state,
            damage: 1,          // 1 damage taken from battlecry
            curHealth: 0,       // current health reduced to 0
        });
    })
})
