/**
 * Test cases for Grimscale Oracle and Murloc Raider
 * 
 * Requirements:
 * 1. start: Player A has a raider on board and oracle in hand, Player B has a raider on board
 * 2. aura: Both raiders initially have 2 attack, after Player A plays oracle, Player A's raider gains +1 attack, no attack occurs
 */

import { GameModel, PlayerModel, MageHeroModel, HandModel, BoardModel } from "hearthstone-core";
import { GrimscaleOracleCardModel } from "../src/grimscale-oracle";
import { MurlocRaiderCardModel } from "../src/murloc-raider";
import { WispCardModel } from "../src/wisp";
import { boot } from "./boot";

describe('grimscale-oracle', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageHeroModel({}),
                    board: new BoardModel({
                        child: { cards: [
                            new MurlocRaiderCardModel({}),
                            new WispCardModel({})
                        ]}
                    }),
                    hand: new HandModel({
                        child: { cards: [new GrimscaleOracleCardModel({})] }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageHeroModel({}),
                    board: new BoardModel({
                        child: { cards: [new MurlocRaiderCardModel({})] }
                    })
                }
            })
        }
    })
    const root = boot(game);

    test('aura', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const handA = game.child.playerA.child.hand;
        
        const cardA = boardA.child.cards.find(item => item instanceof MurlocRaiderCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof MurlocRaiderCardModel);
        const cardC = handA.child.cards.find(item => item instanceof GrimscaleOracleCardModel);
        const cardD = boardA.child.cards.find(item => item instanceof WispCardModel);
        
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        expect(cardC).toBeDefined();
        expect(cardD).toBeDefined();
        if (!cardA || !cardB || !cardC || !cardD) return;
        
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        const roleD = cardD.child.role;
        
        // Initial state: both raiders have 2 attack, wisp has 1 attack
        expect(roleA.state).toMatchObject({
            health: 1,
            attack: 2,
            modAttack: 0,
            curAttack: 2,
        });
        expect(roleB.state).toMatchObject({
            health: 1,
            attack: 2,
            modAttack: 0,
            curAttack: 2,
        });
        expect(roleD.state).toMatchObject({
            health: 1,
            attack: 1,
            modAttack: 0,
            curAttack: 1,
        });
        
        // Play Grimscale Oracle
        await cardC.preparePlay();
        
        // After playing oracle: Player A's raider should gain +1 attack
        expect(roleA.state).toMatchObject({
            health: 1,
            attack: 2,
            modAttack: 1,      // +1 attack from oracle aura
            curAttack: 3,      // 2 + 1 = 3
        });
        
        // Player B's raider should remain unchanged (not affected by Player A's oracle)
        expect(roleB.state).toMatchObject({
            health: 1,
            attack: 2,
            modAttack: 0,      // No aura effect
            curAttack: 2,      // Still 2 attack
        });
        
        // Player A's wisp should remain unchanged (not a murloc, so no aura effect)
        expect(roleD.state).toMatchObject({
            health: 1,
            attack: 1,
            modAttack: 0,      // No aura effect (not a murloc)
            curAttack: 1,      // Still 1 attack
        });
    })
}) 