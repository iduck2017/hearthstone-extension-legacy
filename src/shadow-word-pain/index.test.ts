/**
 * Test cases for Shadow Word: Pain
 * 
 * Initial state: Player A has Shadow Word: Pain in hand.
 * Player B has Aegwynn (5/5/5) and Stonetusk Boar (1/1) on board.
 * 
 * 1. shadow-word-pain-cast: Player A uses Shadow Word: Pain on Stonetusk Boar, destroys it.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { ShadowWordPainModel } from "./index";
import { AegwynnTheGuardianModel } from "../aegwynn-the-guardian";
import { StonetuskBoarModel } from "../stonetusk-boar";
import { boot } from "../boot";

describe('shadow-word-pain', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [] }
                    }),
                    hand: new HandModel({
                        child: { 
                            minions: [],
                            spells: [new ShadowWordPainModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { minions: [] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            minions: [new AegwynnTheGuardianModel(), new StonetuskBoarModel()]
                        }
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
    const boardB = playerB.child.board;
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;
    const handA = playerA.child.hand;
    const cardC = handA.child.spells.find(item => item instanceof ShadowWordPainModel);
    const cardD = boardB.child.minions.find(item => item instanceof AegwynnTheGuardianModel);
    const cardE = boardB.child.minions.find(item => item instanceof StonetuskBoarModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    test('shadow-word-pain-cast', async () => {
        // Check initial state
        expect(boardB.child.minions.length).toBe(2);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.refer.queue.length).toBe(1);

        // Player A uses Shadow Word: Pain
        const promise = cardC.play();
        expect(playerA.child.controller.current?.options).toContain(cardE.child.role); // Stonetusk Boar (1/1) should be targetable
        expect(playerA.child.controller.current?.options).not.toContain(cardD.child.role); // Aegwynn (5/5/5) should not be targetable
        expect(playerA.child.controller.current?.options).not.toContain(heroA.child.role);
        expect(playerA.child.controller.current?.options).not.toContain(heroB.child.role);
        playerA.child.controller.set(cardE.child.role);
        await promise;

        // Stonetusk Boar should be destroyed
        expect(boardB.child.minions.length).toBe(1); // Only Aegwynn remains
        expect(cardE.child.dispose.status).toBe(true);
        expect(cardD.child.dispose.status).toBe(false);
        expect(boardB.child.minions[0]).toBe(cardD);

        // Shadow Word: Pain should be consumed
        expect(handA.refer.queue.length).toBe(0); // Shadow Word: Pain consumed
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 cost
    });
});
