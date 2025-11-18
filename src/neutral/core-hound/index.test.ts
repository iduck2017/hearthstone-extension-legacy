/**
 * Test cases for Core Hound
 * 
 * Initial state: Player A has Core Hound in hand.
 * 
 * 1. core-hound-play: Player A plays Core Hound.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { CoreHoundModel } from "./index";
import { boot } from '../../boot';

describe('core-hound', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: []
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new CoreHoundModel()]
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
                            cards: []
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
    const handA = playerA.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof CoreHoundModel);
    if (!cardC) throw new Error();

    test('core-hound-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(9); // Core Hound: 9/5
        expect(cardC.child.health.state.current).toBe(5);
        expect(handA.child.cards.length).toBe(1); // Core Hound in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Core Hound
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Core Hound should be on board
        expect(boardA.child.cards.length).toBe(1); // Core Hound on board
        expect(handA.child.cards.length).toBe(0); // Core Hound moved to board
        expect(playerA.child.mana.state.current).toBe(3); // 10 - 7 = 3
    });
});
