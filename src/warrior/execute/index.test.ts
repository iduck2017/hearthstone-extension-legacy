/**
 * Test cases for Execute
 * 
 * 1. initial-state: Player A has Wisp and Angry Chicken on board, Execute in hand. Player B has Core Hound on board.
 * 2. wisp-attack:
 *    - Wisp attacks Core Hound
 *    - Assert: Core Hound's health is 4
 *    - Assert: Wisp's health is -8, removed from board, dead
 * 3. angry-chicken-attack:
 *    - Angry Chicken attacks Player B
 *    - Assert: Player B's health is 29
 * 4. execute-cast:
 *    - Player A uses Execute
 *    - Assert: Targets do not include Player A and Player B
 *    - Assert: Targets do not include Angry Chicken
 *    - Select target Core Hound
 *    - Assert: Core Hound's health is still 4
 *    - Assert: Core Hound is destroyed and removed from board
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { ExecuteModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { AngryChickenModel } from "../../neutral/angry-chicken";
import { CoreHoundModel } from "../../neutral/core-hound";
import { boot } from "../../boot";

describe('execute', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new WispModel(), new AngryChickenModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new ExecuteModel()]
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
                            cards: [new CoreHoundModel()]
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
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;
    
    const cardC = boardA.child.cards.find(item => item instanceof WispModel);
    const cardD = boardA.child.cards.find(item => item instanceof AngryChickenModel);
    const cardE = boardB.child.cards.find(item => item instanceof CoreHoundModel);
    const cardF = handA.child.cards.find(item => item instanceof ExecuteModel);
    if (!cardC || !cardD || !cardE || !cardF) throw new Error();

    // initial-state: Player A has Wisp and Angry Chicken on board, Execute in hand. Player B has Core Hound on board.

    test('wisp-attack', async () => {
        // Wisp attacks Core Hound
        let promise = cardC.child.action.run();
        playerA.controller.set(cardE); // Target Core Hound
        await promise;

        // Assert: Core Hound's health is 4
        expect(cardE.child.health.state.current).toBe(4);
        
        // Assert: Wisp's health is -8, removed from board, dead
        expect(cardC.child.health.state.current).toBe(-8);
        expect(cardC.child.dispose.state.isActived).toBe(true);
        expect(boardA.child.cards).not.toContain(cardC);
    });

    test('angry-chicken-attack', async () => {
        // Angry Chicken attacks Player B
        let promise = cardD.child.action.run();
        playerA.controller.set(heroB); // Target Player B's hero
        await promise;

        // Assert: Player B's health is 29
        expect(heroB.child.health.state.current).toBe(29);
    });

    test('execute-cast', async () => {
        // Player A uses Execute
        let promise = cardF.play();
        await CommonUtil.sleep();
        
        // Assert: Targets do not include Player A and Player B
        const selector = playerA.controller.current;
        expect(selector?.options).not.toContain(heroA);
        expect(selector?.options).not.toContain(heroB);
        // Assert: Targets do not include Angry Chicken
        expect(selector?.options).not.toContain(cardD);
        // Select target Core Hound
        playerA.controller.set(cardE);
        await promise;

        // Assert: Core Hound's health is still 4
        expect(cardE.child.health.state.current).toBe(4);
        
        // Assert: Core Hound is destroyed and removed from board
        expect(cardE.child.dispose.state.isActived).toBe(true);
        expect(boardB.child.cards).not.toContain(cardE);
    });
});

