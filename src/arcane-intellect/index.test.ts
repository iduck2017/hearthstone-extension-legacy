/**
 * Test cases for Arcane Intellect
 * 
 * 1. arcane-intellect-cast: Player A plays Arcane Intellect and draws 2 cards
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { ArcaneIntellectModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('arcane-intellect', () => {
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
                        child: { spells: [new ArcaneIntellectModel()] }
                    })),
                    deck: new DeckModel(() => ({
                        child: { 
                            minions: [
                                new WispModel(), 
                                new WispModel()
                            ] 
                        }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [] }
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
    const handA = playerA.child.hand;
    const deckA = playerA.child.deck;
    const cardC = handA.child.spells.find(item => item instanceof ArcaneIntellectModel);
    if (!cardC) throw new Error();

    test('arcane-intellect-cast', async () => {
        // Check initial stats
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.spells.length).toBe(1);
        expect(deckA.child.minions.length).toBe(2);
        expect(handA.child.minions.length).toBe(0);

        // Play Arcane Intellect
        await cardC.play();

        // Should draw 2 cards
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 cost
        expect(handA.child.spells.length).toBe(0); // Arcane Intellect consumed
        expect(deckA.child.minions.length).toBe(0); // 3 - 2 = 1
        expect(handA.child.minions.length).toBe(2); // 2 cards drawn to hand
    })
})
