/**
 * Test cases for Shadow Word: Death
 * 
 * 1. initial-state:
 *    - Player A has Shadow Word: Death in hand
 *    - Player B has Core Hound (9/5) on board
 *    - Player B has Stonetusk Boar (1/1) on board
 * 2. shadow-word-death-cast:
 *    - Player A uses Shadow Word: Death
 *    - Assert: Targets include Core Hound (attack >= 5)
 *    - Assert: Targets do not include Stonetusk Boar (attack < 5)
 *    - Select target Core Hound
 *    - Assert: Core Hound is destroyed and removed from board
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { ShadowWordDeathModel } from "./index";
import { StonetuskBoarModel } from "../../neutral/stonetusk-boar";
import { CoreHoundModel } from "../../neutral/core-hound";
import { boot } from "../../boot";

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
    const cardC = handA.child.cards.find(item => item instanceof ShadowWordDeathModel);
    const cardD = boardB.child.cards.find(item => item instanceof CoreHoundModel);
    const cardE = boardB.child.cards.find(item => item instanceof StonetuskBoarModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    // initial-state:
    // - Player A has Shadow Word: Death in hand
    // - Player B has Core Hound (9/5) on board
    // - Player B has Stonetusk Boar (1/1) on board

    test('shadow-word-death-cast', async () => {
        // Player A uses Shadow Word: Death
        let promise = cardC.play();
        
        // Assert: Targets include Core Hound (attack >= 5)
        expect(playerA.controller.current?.options).toContain(cardD);
        
        // Assert: Targets do not include Stonetusk Boar (attack < 5)
        expect(playerA.controller.current?.options).not.toContain(cardE);
        
        // Select target Core Hound
        playerA.controller.set(cardD);
        await promise;

        // Assert: Core Hound is destroyed and removed from board
        expect(cardD.child.dispose.state.isActived).toBe(true);
        expect(boardB.child.cards).not.toContain(cardD);
    });
});
