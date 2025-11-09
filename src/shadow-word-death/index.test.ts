/**
 * Test cases for Shadow Word: Death
 * 
 * Initial state: Player A has Shadow Word: Death in hand.
 * Player B has Aegwynn (5/5/5) and Stonetusk Boar (1/1) on board.
 * 
 * 1. shadow-word-death-cast: Player A uses Shadow Word: Death on Aegwynn, destroys it.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { ShadowWordDeathModel } from "./index";
import { StonetuskBoarModel } from "../stonetusk-boar";
import { boot } from "../boot";
import { AegwynnTheGuardianModel } from "../aegwynn-the-guardian";

describe('shadow-word-death', () => {
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
                            cards: [new ShadowWordDeathModel()]
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
                            cards: [new AegwynnTheGuardianModel(), new StonetuskBoarModel()]
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
    const boardB = playerB.child.board;
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;
    const handA = playerA.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof ShadowWordDeathModel);
    const cardD = boardB.child.cards.find(item => item instanceof AegwynnTheGuardianModel);
    const cardE = boardB.child.cards.find(item => item instanceof StonetuskBoarModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    test('shadow-word-death-cast', async () => {
        // Check initial state
        expect(boardB.child.cards.length).toBe(2);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(1);

        // Player A uses Shadow Word: Death
        const promise = cardC.play();
        expect(playerA.child.controller.current?.options).toContain(cardD); // Aegwynn (5/5/5) should be targetable
        expect(playerA.child.controller.current?.options).not.toContain(cardE); // Stonetusk Boar (1/1) should not be targetable
        expect(playerA.child.controller.current?.options).not.toContain(heroA);
        expect(playerA.child.controller.current?.options).not.toContain(heroB); 
        playerA.child.controller.set(cardD);
        await promise;

        // Aegwynn should be destroyed
        expect(boardB.child.cards.length).toBe(1); // Only Stonetusk Boar remains
        expect(cardD.child.dispose.status).toBe(true);
        expect(cardE.child.dispose.status).toBe(false);
        expect(boardB.child.cards[0]).toBe(cardE);

        // Shadow Word: Death should be consumed
        expect(handA.child.cards.length).toBe(0); // Shadow Word: Death consumed
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 cost
    });
});
