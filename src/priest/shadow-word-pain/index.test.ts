/**
 * Test cases for Shadow Word: Pain
 * 
 * Initial state: Player A has Shadow Word: Pain in hand.
 * Player B has Stranglethorn Tiger (5/5/5) and Stonetusk Boar (1/1) on board.
 * 
 * 1. shadow-word-pain-cast: Player A uses Shadow Word: Pain on Stonetusk Boar, destroys it.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { ShadowWordPainModel } from "./index";
import { StranglethornTigerModel } from "../../neutral/stranglethorn-tiger";
import { StonetuskBoarModel } from "../../neutral/stonetusk-boar";
import { boot } from "../../boot";

describe('shadow-word-pain', () => {
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
                            cards: [new ShadowWordPainModel()]
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
                            cards: [new StranglethornTigerModel(), new StonetuskBoarModel()]
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
    const cardC = handA.child.cards.find(item => item instanceof ShadowWordPainModel);
    const cardD = boardB.child.cards.find(item => item instanceof StranglethornTigerModel);
    const cardE = boardB.child.cards.find(item => item instanceof StonetuskBoarModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    test('shadow-word-pain-cast', async () => {
        // Check initial state
        expect(boardB.child.cards.length).toBe(2);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(1);

        // Player A uses Shadow Word: Pain
        const promise = cardC.play();
        expect(playerA.controller.current?.options).toContain(cardE); // Stonetusk Boar (1/1) should be targetable
        expect(playerA.controller.current?.options).not.toContain(cardD); // Stranglethorn Tiger (5/5/5) should not be targetable
        expect(playerA.controller.current?.options).not.toContain(heroA);
        expect(playerA.controller.current?.options).not.toContain(heroB);
        playerA.controller.set(cardE);
        await promise;

        // Stonetusk Boar should be destroyed
        expect(boardB.child.cards.length).toBe(1); // Only Stranglethorn Tiger remains
        expect(cardE.child.dispose.state.isActived).toBe(true);
        expect(cardD.child.dispose.state.isActived).toBe(false);
        expect(boardB.child.cards[0]).toBe(cardD);

        // Shadow Word: Pain should be consumed
        expect(handA.child.cards.length).toBe(0); // Shadow Word: Pain consumed
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 cost
    });
});
