/**
 * Test cases for Spellbender
 * 
 * 1. frost-nova-cast: Player B has Spellbender and Wisp on board, Player A casts Frost Nova (should not trigger on non-targeted spells)
 * 2. ice-lance-cast: Player A casts Ice Lance targeting Wisp, triggers Spellbender, Spellbender minion gets frozen instead
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil } from "hearthstone-core";
import { SpellbenderModel } from "./index";
import { SpellbenderMinionModel } from "./minion";
import { FrostNovaModel } from "../frost-nova";
import { IceLanceModel } from "../ice-lance";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('spellbender', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [] }
                    })),
                    hand: new HandModel(() => ({
                        child: {
                            spells: [new FrostNovaModel(), new IceLanceModel()]
                        }
                    })),
                    deck: new DeckModel(() => ({
                        child: {
                            minions: []
                        }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { 
                            minions: [new WispModel()],
                            secrets: [new SpellbenderModel()]
                        }
                    })),
                }
            }))
        }
    }));
    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const handA = playerA.child.hand;
    const boardB = playerB.child.board;
    const cardC = handA.child.spells.find(item => item instanceof FrostNovaModel);
    const cardD = handA.child.spells.find(item => item instanceof IceLanceModel);
    const cardF = boardB.child.minions.find(item => item instanceof WispModel);
    const roleF = cardF?.child.role;
    if (!cardC || !cardD || !roleF) throw new Error();

    test('frost-nova-cast', async () => {
        // Check initial stats
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.spells.length).toBe(2);
        expect(boardB.child.minions.length).toBe(1); // Only Wisp
        expect(boardB.child.secrets.length).toBe(1);
        expect(roleF.child.entries.child.frozen.state.isActive).toBe(false);

        // Player A casts Frost Nova (should not trigger Spellbender on non-targeted spells)
        await cardC.play();

        // Check Frost Nova effect: all enemy minions should be frozen
        expect(roleF.child.entries.child.frozen.state.isActive).toBe(true);
        
        // Spellbender should still be active (not triggered)
        expect(boardB.child.secrets.length).toBe(1);
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 cost
        expect(handA.child.spells.length).toBe(1); // Only Ice Lance left
    });

    test('ice-lance-cast', async () => {
        // Check initial stats
        expect(playerA.child.mana.state.current).toBe(7);
        expect(handA.child.spells.length).toBe(1);
        expect(boardB.child.secrets.length).toBe(1);
        expect(boardB.child.minions.length).toBe(1); // Only Wisp
        expect(roleF.child.entries.child.frozen.state.isActive).toBe(true);

        // Player A casts Ice Lance targeting Wisp (should trigger Spellbender)
        const promise = cardD.play();
        expect(SelectUtil.current?.options).toContain(roleF);
        SelectUtil.set(roleF);
        await promise;

        // Check Spellbender triggered: secret should be consumed
        expect(boardB.child.secrets.length).toBe(0);
        
        // Check that Spellbender minion was summoned and gets frozen instead of Wisp
        expect(boardB.child.minions.length).toBe(2); // Wisp + summoned Spellbender
        const cardE = boardB.child.minions.find(item => item instanceof SpellbenderMinionModel);
        expect(cardE).toBeDefined();
        if (!cardE) throw new Error();

        const roleE = cardE.child.role;
        expect(roleE.child.entries.child.frozen.state.isActive).toBe(true); // Spellbender gets frozen
        expect(cardF.child.dispose.status).toBe(false); // Wisp is alive
        expect(roleF.child.health.state.current).toBe(1); // Wisp is alive
        
        // Check mana and hand
        expect(playerA.child.mana.state.current).toBe(6); // 7 - 1 cost
        expect(handA.child.spells.length).toBe(0);
    });
});
