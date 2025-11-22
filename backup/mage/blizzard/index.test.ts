/**
 * Test cases for Blizzard
 * 
 * 1. blizzard-cast: Player A uses Blizzard on enemy minions, deals 2 damage and freezes them
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { BlizzardModel } from "./index";
import { WispModel } from "../../../src/neutral/wisp";
import { WaterElementalModel } from "../water-elemental";
import { boot } from "../../../src/boot";

describe('blizzard', () => {
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
                        child: { cards: [new BlizzardModel()] }
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
                        child: { cards: [new WispModel(), new WaterElementalModel()] }
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
    const boardB = playerB.child.board;
    const cardC = handA.child.cards.find(item => item instanceof BlizzardModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    const cardE = boardB.child.cards.find(item => item instanceof WaterElementalModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    test('blizzard-cast', async () => {
        // Check initial stats
        expect(cardD.child.health.state.current).toBe(1); // Wisp: 1 health
        expect(cardE.child.health.state.current).toBe(6); // Water Elemental: 6 health
        expect(cardD.child.frozen.state.actived).toBe(false);
        expect(cardE.child.frozen.state.actived).toBe(false);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(1);
        expect(boardB.child.cards.length).toBe(2);

        // Play Blizzard - no target selection needed
        await cardC.play();

        // All enemy minions should take 2 damage and be frozen
        expect(cardD.child.health.state.current).toBe(-1); // Wisp: 1 - 2 = -1 (dies)
        expect(cardD.child.frozen.state.actived).toBe(true);
        expect(cardD.child.dispose.status).toBe(true);

        expect(cardE.child.health.state.current).toBe(4); // Water Elemental: 6 - 2 = 4 (survives)
        expect(cardE.child.frozen.state.actived).toBe(true);
        
        expect(playerB.child.hero.child.health.state.current).toBe(30);

        expect(playerA.child.mana.state.current).toBe(4); // 10 - 6 cost
        expect(handA.child.cards.length).toBe(0);

        // Only dead minion (Wisp) should be removed from board
        expect(boardB.child.cards.length).toBe(1);
    })
})
