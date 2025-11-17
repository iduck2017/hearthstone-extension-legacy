/**
 * Test cases for Vaporize
 * 
 * 1. wisp-attack: Player A's Wisp attacks Player B's Stonetusk Boar (should not trigger Vaporize)
 * 2. voodoo-doctor-attack: Player A's Voodoo Doctor attacks Player B's hero (should trigger Vaporize)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { VaporizeModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { VoodooDoctorModel } from "../../neutral/voodoo-doctor";
import { StonetuskBoarModel } from "../../neutral/stonetusk-boar";
import { boot } from "../../boot";

describe('vaporize', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new WispModel(), new VoodooDoctorModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new StonetuskBoarModel()],
                            secrets: [new VaporizeModel()]
                        }
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
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const cardC = boardA.child.cards.find(item => item instanceof WispModel);
    const cardD = boardA.child.cards.find(item => item instanceof VoodooDoctorModel);
    const cardE = boardB.child.cards.find(item => item instanceof StonetuskBoarModel);
    const cardF = boardB.child.secrets.find(item => item instanceof VaporizeModel);
    if (!cardC || !cardD || !cardE) throw new Error();
    const heroB = playerB.child.hero;

    test('wisp-attack', async () => {
        // Check initial stats
        expect(boardA.child.cards.length).toBe(2);
        expect(boardB.child.cards.length).toBe(1);
        expect(boardB.child.secrets.length).toBe(1);
        expect(cardC.child.health.state.current).toBe(1); // Wisp: 1/1
        expect(cardE.child.health.state.current).toBe(1); // Stonetusk Boar: 1/1
        expect(heroB.child.health.state.current).toBe(30); // Player B hero: 30 health

        // Player A's Wisp attacks Player B's Stonetusk Boar
        const promise = cardC.child.action.start();
        const selector = playerA.child.controller.current;
        expect(selector?.options).toContain(cardE);
        playerA.child.controller.set(cardE);
        await promise;

        // Check that both minions die (1/1 vs 1/1)
        expect(cardC.child.health.state.current).toBe(0); // Wisp dies
        expect(cardE.child.health.state.current).toBe(0); // Stonetusk Boar dies
        expect(cardC.child.dispose.status).toBe(true); // Wisp disposed
        expect(cardE.child.dispose.status).toBe(true); // Stonetusk Boar disposed
        
        // Vaporize should not trigger (minion attacking minion, not hero)
        expect(boardB.child.secrets.length).toBe(1); // Secret still active
        expect(heroB.child.health.state.current).toBe(30); // Hero health unchanged
        
        // Check board state
        expect(boardA.child.cards.length).toBe(1); // Only Voodoo Doctor left
        expect(boardB.child.cards.length).toBe(0); // No minions left
    });

    test('voodoo-doctor-attack', async () => {
        // Check initial stats
        expect(boardA.child.cards.length).toBe(1); // Only Voodoo Doctor
        expect(boardB.child.cards.length).toBe(0); // No minions
        expect(boardB.child.secrets.length).toBe(1); // Vaporize still active
        expect(cardD.child.health.state.current).toBe(1); // Voodoo Doctor: 2/1
        expect(heroB.child.health.state.current).toBe(30); // Player B hero: 30 health

        // Player A's Voodoo Doctor attacks Player B's hero
        const promise = cardD.child.action.start();
        const selector = playerA.child.controller.current;
        expect(selector?.options).toContain(heroB);
        playerA.child.controller.set(heroB);
        await promise;

        // Check Vaporize triggered: Voodoo Doctor should be destroyed
        expect(cardD.child.health.state.current).toBe(1); 
        // expect(cardD.child.dispose.state.isLock).toBe(true);
        // expect(cardD.child.dispose.refer.source).toBe(cardF);
        expect(cardD.child.dispose.status).toBe(true); // Voodoo Doctor disposed
        
        // Vaporize should be consumed
        expect(boardB.child.secrets.length).toBe(0); // Secret consumed
        
        // Player B's hero should not take damage (Vaporize prevented the attack)
        expect(heroB.child.health.state.current).toBe(30); // Hero health unchanged
        
        // Check board state
        expect(boardA.child.cards.length).toBe(0); // No minions left
        expect(boardB.child.cards.length).toBe(0); // No minions
    });
});
