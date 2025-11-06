/**
 * Test cases for Aegwynn, the Guardian
 * 
 * Initial state: Player B has Aegwynn on board, hand with Arcane Intellect, Frostbolt, Arcane Missiles, deck with Wisp, Stonetusk Boar, Mana Wyrm. Player A has Fireball in hand.
 * 
 * 1. fireball-cast: Player A uses Fireball to kill Aegwynn (5-6=-1)
 * 2. wisp-play: End turn, Player B draws and plays Wisp
 * 3. frostbolt-cast: Player B uses Frostbolt on Wisp, deals 3+2=5 damage, Wisp dies (1-5=-4)
 * 4. arcane-intellect-cast: Player B uses Arcane Intellect, draws Stonetusk Boar and Mana Wyrm
 * 5. stonetusk-boar-play: Player B plays Boar and Mana Wyrm
 * 6. arcane-missiles: Player B plays Arcane Missiles, deals 3+2=5 damage, Player A health becomes 25
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { AegwynnTheGuardianModel } from "./index";
import { FireballModel } from "../fireball";
import { ArcaneIntellectModel } from "../arcane-intellect";
import { FrostboltModel } from "../frostbolt";
import { ArcaneMissilesModel } from "../arcane-missiles";
import { WispModel } from "../wisp";
import { StonetuskBoarModel } from "../stonetusk-boar";
import { ManaWyrmModel } from "../mana-wyrm";
import { boot } from "../boot";

describe('aegwynn-the-guardian', () => {
    const game = new GameModel({
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
                    }),
                    deck: new DeckModel({
                        child: { minions: [new WispModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [new AegwynnTheGuardianModel()] }
                    }),
                    hand: new HandModel({
                        child: { 
                            spells: [new ArcaneIntellectModel(), new FrostboltModel(), new ArcaneMissilesModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: {
                            minions: [new WispModel(), new StonetuskBoarModel(), new ManaWyrmModel()]
                        }
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
    const boardB = playerB.child.board;
    const deckB = playerB.child.deck;
    const cardC = handA.child.spells.find(item => item instanceof FireballModel);
    const cardD = boardB.child.minions.find(item => item instanceof AegwynnTheGuardianModel);
    const cardE = handB.child.spells.find(item => item instanceof FrostboltModel);
    const cardF = handB.child.spells.find(item => item instanceof ArcaneIntellectModel);
    const cardG = handB.child.spells.find(item => item instanceof ArcaneMissilesModel);
    const cardH = deckB.child.minions.find(item => item instanceof WispModel);
    const cardI = deckB.child.minions.find(item => item instanceof StonetuskBoarModel);
    const cardJ = deckB.child.minions.find(item => item instanceof ManaWyrmModel);
    const roleD = cardD?.child.role;
    const roleA = playerA.child.hero.child.role;
    if (!cardC || !roleD || !cardH || !cardI || !cardJ || !cardE || !cardF || !cardG) throw new Error();
    const roleH = cardH?.child.role;
    const roleI = cardI?.child.role;
    const roleJ = cardJ?.child.role;
    
    test('fireball-cast', async () => {
        // Check initial stats
        expect(roleD.child.health.state.current).toBe(5); // Aegwynn: 5/5
        expect(roleD.child.attack.state.current).toBe(5);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.spells.length).toBe(1);

        // Player A uses Fireball on Aegwynn
        const promise = cardC.play();
        expect(playerA.child.controller.current?.options).toContain(roleD);
        playerA.child.controller.set(roleD);
        await promise;

        // Aegwynn should die (5 - 6 = -1)
        expect(roleD.child.health.state.current).toBe(-1);
        expect(cardD.child.dispose.status).toBe(true);
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 cost
        expect(handA.child.spells.length).toBe(0);
    });

    test('wisp-play', async () => {
        // End turn to Player B
        game.child.turn.next();
        // Check initial stats
        expect(playerB.child.mana.state.current).toBe(10);
        expect(handB.child.minions.length).toBe(1);
        expect(deckB.child.minions.length).toBe(2);

        // Play Wisp
        const promise = cardH.play();
        playerB.child.controller.set(0); // Select position 0
        await promise;

        // Check Wisp is played
        expect(playerB.child.mana.state.current).toBe(10); // 10 - 0 cost
        expect(handB.child.minions.length).toBe(0);
        expect(boardB.child.minions.length).toBe(1);
    });

    test('frostbolt-cast', async () => {
        // Check initial stats
        expect(roleH.child.health.state.current).toBe(1); // Wisp: 1/1
        expect(playerB.child.mana.state.current).toBe(10);
        expect(handB.child.spells.length).toBe(3);

        // Player B uses Frostbolt on Wisp (with +2 spell damage from Aegwynn's deathrattle)
        const promise = cardE.play();
        expect(playerB.child.controller.current?.options).toContain(roleH);
        playerB.child.controller.set(roleH);
        await promise;

        // Wisp should die (1 - 5 = -4) due to 3 + 2 = 5 damage
        expect(roleH.child.health.state.current).toBe(-4);
        expect(cardH.child.dispose.status).toBe(true);
        expect(playerB.child.mana.state.current).toBe(8); // 10 - 2 cost
        expect(handB.child.spells.length).toBe(2);
    });

    test('arcane-intellect-cast', async () => {
        // Check initial stats
        expect(playerB.child.mana.state.current).toBe(8);
        expect(handB.child.minions.length).toBe(0);
        expect(deckB.child.minions.length).toBe(2);

        // Player B uses Arcane Intellect
        await cardF.play();

        // Should draw 2 cards (Stonetusk Boar and Mana Wyrm)
        expect(playerB.child.mana.state.current).toBe(5); // 8 - 3 cost
        expect(handB.child.spells.length).toBe(1); // Arcane Intellect consumed
        expect(deckB.child.minions.length).toBe(0); // 2 - 2 = 0
        expect(handB.child.minions.length).toBe(2); // 2 cards drawn
    });

    test('stonetusk-boar-play', async () => {
        // Check initial stats
        expect(playerB.child.mana.state.current).toBe(5);
        expect(handB.child.minions.length).toBe(2);
        expect(boardB.child.minions.length).toBe(0);

        // Player B plays Stonetusk Boar
        let promise = cardI.play();
        playerB.child.controller.set(0); // Select position 0
        await promise;

        // Player B plays Mana Wyrm
        promise = cardJ.play();
        playerB.child.controller.set(0); // Select position 0
        await promise;

        // Check both minions are played
        expect(playerB.child.mana.state.current).toBe(3); 
        expect(handB.child.minions.length).toBe(0);
        expect(boardB.child.minions.length).toBe(2);
    });

    test('arcane-missiles', async () => {
        // Check initial stats
        expect(playerB.child.mana.state.current).toBe(3);
        expect(roleA.child.health.state.current).toBe(30); // Player A hero: 30 health

        // Player B uses Arcane Missiles (with +2 spell damage from inherited powers)
        await cardG.play();

        // Should deal 3 + 2 = 5 damage to Player A
        expect(roleA.child.health.state.current).toBe(25); // 30 - 5 = 25
        expect(handB.child.spells.length).toBe(0); // Arcane Missiles consumed
    });
});
