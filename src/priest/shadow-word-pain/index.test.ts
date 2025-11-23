/**
 * Test cases for Shadow Word: Pain
 * 
 * 1. initial-state:
 *    - Player A has Shadow Word: Pain in hand
 *    - Player B has Core Hound (9/5) on board
 *    - Player B has Stonetusk Boar (1/1) on board
 * 2. shadow-word-pain-cast:
 *    - Player A uses Shadow Word: Pain
 *    - Assert: Targets include Stonetusk Boar (attack <= 3)
 *    - Assert: Targets do not include Core Hound (attack > 3)
 *    - Select target Stonetusk Boar
 *    - Assert: Stonetusk Boar is destroyed and removed from board
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { ShadowWordPainModel } from "./index";
import { CoreHoundModel } from "../../neutral/core-hound";
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
                            cards: [new CoreHoundModel(), new StonetuskBoarModel()]
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
    const cardD = boardB.child.cards.find(item => item instanceof CoreHoundModel);
    const cardE = boardB.child.cards.find(item => item instanceof StonetuskBoarModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    // initial-state:
    // - Player A has Shadow Word: Pain in hand
    // - Player B has Core Hound (9/5) on board
    // - Player B has Stonetusk Boar (1/1) on board

    test('shadow-word-pain-cast', async () => {
        // Player A uses Shadow Word: Pain
        let promise = cardC.play();
        
        // Assert: Targets include Stonetusk Boar (attack <= 3)
        expect(playerA.controller.current?.options).toContain(cardE);
        
        // Assert: Targets do not include Core Hound (attack > 3)
        expect(playerA.controller.current?.options).not.toContain(cardD);
        
        // Select target Stonetusk Boar
        playerA.controller.set(cardE);
        await promise;

        // Assert: Stonetusk Boar is destroyed and removed from board
        expect(cardE.child.dispose.state.isActived).toBe(true);
        expect(boardB.child.cards).not.toContain(cardE);
    });
});
