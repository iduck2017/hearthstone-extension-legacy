/**
 * Test cases for Silver Hand Knight
 * 
 * Initial state: Player A has Silver Hand Knight in hand.
 * Player B has empty board.
 * 
 * 1. silver-hand-knight-play: Player A plays Silver Hand Knight, summoning a Squire.
 * 2. squire-attack: Player A's Squire attacks Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { SilverHandKnightModel } from "./index";
import { SquireModel } from "../squire";
import { boot } from "../boot";

describe('silver-hand-knight', () => {
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
                            cards: [new SilverHandKnightModel()]
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
                        child: { 
                            cards: []
                        }
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
    const cardC = handA.child.cards.find(item => item instanceof SilverHandKnightModel);
    if (!cardC) throw new Error();

    test('silver-hand-knight-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(4); // Silver Hand Knight: 4/4
        expect(cardC.child.health.state.current).toBe(4);
        expect(handA.child.cards.length).toBe(1); // Silver Hand Knight in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Silver Hand Knight
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Silver Hand Knight should be on board
        expect(boardA.child.cards.length).toBe(2); // Silver Hand Knight + Squire on board
        expect(handA.child.cards.length).toBe(0); // Silver Hand Knight moved to board
        expect(playerA.child.mana.state.current).toBe(5); // 10 - 5 = 5

        // Check that Squire was summoned
        const cardD = boardA.child.cards.find(item => item instanceof SquireModel);
        expect(cardD).toBeDefined();
        if (cardD) {
            expect(cardD.child.attack.state.current).toBe(2); // Squire: 2/2
            expect(cardD.child.health.state.current).toBe(2);
        }
    });
});
