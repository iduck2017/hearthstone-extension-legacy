/**
 * Test cases for Sorcerer's Apprentice
 * 
 * 1. sorcerers-apprentice-play: Player A deploys Sorcerer's Apprentice
 * 2. frostbolt-cost: Player A casts Frostbolt with reduced cost (1)
 * 3. icelance-cost: Player A casts Ice Lance with minimum cost (1)
 * 4. frostbolt-cost: Player B casts Frostbolt with normal cost (2)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { SorcerersApprenticeModel } from "./index";
import { FrostboltModel } from "../frostbolt";
import { IceLanceModel } from "../ice-lance";
import { boot } from "../boot";

describe('sorcerers-apprentice', () => {
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
                        child: { 
                            cards: [new SorcerersApprenticeModel(), new FrostboltModel(), new IceLanceModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { 
                            cards: [] 
                        }
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
                        child: { cards: [new FrostboltModel()] }
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
    const boardA = playerA.child.board;
    const cardC = handA.child.cards.find(item => item instanceof SorcerersApprenticeModel);
    const cardD = handA.child.cards.find(item => item instanceof FrostboltModel);
    const cardE = handA.child.cards.find(item => item instanceof IceLanceModel);
    const cardF = handB.child.cards.find(item => item instanceof FrostboltModel);
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    if (!cardC || !cardD || !cardE || !cardF) throw new Error();

    test('sorcerers-apprentice-play', async () => {
        // Check initial stats
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(3);
        expect(boardA.child.cards.length).toBe(0);
        expect(cardD.child.cost.state.current).toBe(2);

        expect(cardD.child.cost.state.current).toBe(2);
        expect(cardE.child.cost.state.current).toBe(1);
        expect(cardF.child.cost.state.current).toBe(2);

        // Deploy Sorcerer's Apprentice
        const promise = cardC.play();
        playerA.child.controller.set(0);
        await promise;

        expect(cardD.child.cost.state.current).toBe(1);
        expect(cardE.child.cost.state.current).toBe(1);
        expect(cardF.child.cost.state.current).toBe(2);
        
        // Check deployment and cost reduction
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 cost
        expect(handA.child.cards.length).toBe(2);
        expect(boardA.child.cards.length).toBe(1);
        expect(boardA.child.cards[0]).toBe(cardC);
        expect(cardD.child.cost.state.current).toBe(1); // Frostbolt cost reduced
    })

    test('frostbolt-cost', async () => {
        // Player A casts Frostbolt (should cost 1 instead of 2)
        expect(playerA.child.mana.state.current).toBe(8);
        expect(cardD.child.cost.state.current).toBe(1);
        
        const promise = cardD.play();
        playerA.child.controller.set(roleB);
        await promise;
        
        expect(playerA.child.mana.state.current).toBe(7); // 8 - 1 = 7
    })

    test('icelance-cost', async () => {
        // Player A casts Ice Lance (should still cost 1, not 0)
        expect(playerA.child.mana.state.current).toBe(7);
        expect(cardE.child.cost.state.current).toBe(1);
        
        const promise = cardE.play();
        playerA.child.controller.set(roleB);
        await promise;
        
        expect(playerA.child.mana.state.current).toBe(6); // 7 - 1 = 6
    })

    test('frostbolt-cost', async () => {
        game.child.turn.next();

        // Player B casts Frostbolt (should cost normal 2, not reduced)
        expect(playerB.child.mana.state.current).toBe(10);
        expect(cardF.child.cost.state.current).toBe(2);
        
        const promise = cardF.play();
        playerB.child.controller.set(roleA);
        await promise;
        
        expect(playerB.child.mana.state.current).toBe(8); // 10 - 2 = 8
    })
})
