/**
 * Test cases for Shadow Word: Ruin
 * 
 * Initial state: Player A has Shadow Word: Ruin in hand.
 * Player A has minions with different attack values on board.
 * Player B has minions with different attack values on board.
 * 
 * 1. shadow-word-ruin-cast: Player A casts Shadow Word: Ruin, destroying all minions with 5 or more Attack.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { ShadowWordRuinModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { WaterElementalModel } from "../../mage/water-elemental";
import { AegwynnTheGuardianModel } from "../../mage/aegwynn-the-guardian";
import { boot } from "../../boot";

describe('shadow-word-ruin', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new WispModel(), new WaterElementalModel(), new AegwynnTheGuardianModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new ShadowWordRuinModel()]
                        }
                    }),
                    deck: new DeckModel({
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
                            cards: [new WispModel(), new WaterElementalModel()]
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
    const handA = playerA.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof ShadowWordRuinModel);
    const cardD = boardA.child.cards.find(item => item instanceof WispModel);
    const cardE = boardA.child.cards.find(item => item instanceof WaterElementalModel);
    const cardF = boardA.child.cards.find(item => item instanceof AegwynnTheGuardianModel);
    const cardG = boardB.child.cards.find(item => item instanceof WispModel);
    const cardH = boardB.child.cards.find(item => item instanceof WaterElementalModel);
    if (!cardC || !cardD || !cardE || !cardF || !cardG || !cardH) throw new Error();

    test('shadow-word-ruin-cast', async () => {
        // Check initial state
        expect(cardD.child.attack.state.current).toBe(1); // Wisp: 1/1 (should survive)
        expect(cardD.child.health.state.current).toBe(1);
        expect(cardE.child.attack.state.current).toBe(3); // Water Elemental: 3/6 (should survive)
        expect(cardE.child.health.state.current).toBe(6);
        expect(cardF.child.attack.state.current).toBe(5); // Aegwynn: 5/5 (should be destroyed)
        expect(cardF.child.health.state.current).toBe(5);
        expect(cardG.child.attack.state.current).toBe(1); // Enemy Wisp: 1/1 (should survive)
        expect(cardG.child.health.state.current).toBe(1);
        expect(cardH.child.attack.state.current).toBe(3); // Enemy Water Elemental: 3/6 (should survive)
        expect(cardH.child.health.state.current).toBe(6);

        // Check initial board state
        expect(boardA.child.cards.length).toBe(3);
        expect(boardB.child.cards.length).toBe(2);

        // Cast Shadow Word: Ruin
        let promise = cardC.play();
        await promise;

        // Only Aegwynn (5/5) should be destroyed, others should survive
        expect(cardD.child.dispose.status).toBe(false); // Wisp survives
        expect(cardE.child.dispose.status).toBe(false); // Water Elemental survives
        expect(cardF.child.dispose.status).toBe(true); // Aegwynn destroyed
        expect(cardG.child.dispose.status).toBe(false); // Enemy Wisp survives
        expect(cardH.child.dispose.status).toBe(false); // Enemy Water Elemental survives

        // Check final board state
        expect(boardA.child.cards.length).toBe(2); // Wisp and Water Elemental remain
        expect(boardB.child.cards.length).toBe(2); // Both enemy minions remain

        // Shadow Word: Ruin should be consumed
        expect(handA.child.cards.length).toBe(0); // Shadow Word: Ruin consumed
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6
    });
});
