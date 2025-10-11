/**
 * Test cases for Archmage Antonidas
 * 
 * Initial state: Player A has Antonidas on board, hand with Frostbolt and Arcane Intellect. Player B has Wisp on board.
 * 
 * 1. antonidas-play: Player A plays Antonidas (7/5/7)
 * 2. frostbolt-cast: Player A uses Frostbolt on Wisp, Antonidas adds Fireball to hand
 * 3. arcane-intellect-cast: Player A uses Arcane Intellect, Antonidas adds another Fireball
 * 4. fireball-cast: Player A uses the generated Fireball on Wisp
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil } from "hearthstone-core";
import { ArchmageAntonidasModel } from "./index";
import { FrostboltModel } from "../frostbolt";
import { ArcaneIntellectModel } from "../arcane-intellect";
import { FireballModel } from "../fireball";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('archmage-antonidas', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [new ArchmageAntonidasModel()] }
                    }),
                    hand: new HandModel({
                        child: { 
                            spells: [new FrostboltModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: {
                            minions: [new WispModel()]
                        }
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

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const handA = playerA.child.hand;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const cardC = boardA.child.minions.find(item => item instanceof ArchmageAntonidasModel);
    const cardD = handA.child.spells.find(item => item instanceof FrostboltModel);
    const cardF = boardB.child.minions.find(item => item instanceof WispModel);
    const roleF = cardF?.child.role;
    if (!cardC || !cardD || !roleF) throw new Error();

    test('frostbolt-cast', async () => {
        // Check initial stats
        expect(handA.child.spells.length).toBe(1); // Frostbolt, Arcane Intellect
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.spells.some(spell => spell instanceof FireballModel)).toBe(false);

        // Player A uses Frostbolt on Wisp
        const promise = cardD.play();
        expect(SelectUtil.current?.options).toContain(roleF);
        SelectUtil.set(roleF);
        await promise;

        // Antonidas should add a Fireball to hand
        expect(handA.child.spells.length).toBe(1); // Arcane Intellect + generated Fireball
        expect(handA.child.spells.some(spell => spell instanceof FireballModel)).toBe(true);
        expect(boardB.refer.queue?.length).toBe(0);
        expect(roleF.child.health.state.current).toBe(-2); // Wisp: 1 - 3 = -2 (dies)
        expect(playerA.child.mana.state.current).toBe(8); // 3 - 2 cost
    });

    test('fireball-cast', async () => {
        // Get the generated Fireball
        const cardG = handA.child.spells.find(spell => spell instanceof FireballModel);
        if (!cardG) throw new Error();

        // Check initial stats
        expect(playerA.child.mana.state.current).toBe(8);
        expect(handA.child.spells.length).toBe(1);

        // Player A uses the generated Fireball on Wisp (which should be dead, so target hero)
        const roleB = playerB.child.hero.child.role;
        const promise = cardG.play();
        expect(SelectUtil.current?.options).toContain(roleB);
        SelectUtil.set(roleB);
        await promise;

        // Check Fireball was used
        expect(playerA.child.mana.state.current).toBe(4);
        expect(handA.child.spells.length).toBe(1); // Fireball consumed
        expect(handA.child.spells.some(spell => spell instanceof FireballModel)).toBe(true);
        expect(roleB.child.health.state.current).toBe(24); // 30 - 6 = 24
    });
});
