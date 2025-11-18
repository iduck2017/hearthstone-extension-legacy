/**
 * Test cases for Stampeding Kodo
 * 
 * Initial state: Player A has Stampeding Kodo in hand.
 * Player B has a Wisp (1/1) and a Chillwind Yeti (4/5) on board.
 * 
 * 1. stampeding-kodo-play: Player A plays Stampeding Kodo, destroying the Wisp.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { StampedingKodoModel } from "./index";
import { WispModel } from '../../neutral/wisp';
import { ChillwindYetiModel } from "../chillwind-yeti";
import { boot } from '../../boot';

describe('stampeding-kodo', () => {
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
                            cards: [new StampedingKodoModel()]
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
                            cards: [new WispModel(), new ChillwindYetiModel()]
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
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof StampedingKodoModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    const cardE = boardB.child.cards.find(item => item instanceof ChillwindYetiModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    test('stampeding-kodo-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(3); // Stampeding Kodo: 3/5
        expect(cardC.child.health.state.current).toBe(5);
        expect(handA.child.cards.length).toBe(1); // Stampeding Kodo in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(boardB.child.cards.length).toBe(2); // Wisp and Chillwind Yeti on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Check enemy minions
        expect(cardD.child.attack.state.current).toBe(1); // Wisp: 1/1 (valid target)
        expect(cardE.child.attack.state.current).toBe(4); // Chillwind Yeti: 4/5 (invalid target)

        // Play Stampeding Kodo
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Stampeding Kodo should be on board
        expect(boardA.child.cards.length).toBe(1); // Stampeding Kodo on board
        expect(handA.child.cards.length).toBe(0); // Stampeding Kodo moved to board
        expect(playerA.child.mana.state.current).toBe(5); // 10 - 5 = 5

        // Wisp should be destroyed (random target with 2 or less attack)
        expect(boardB.child.cards.length).toBe(1); // Only Chillwind Yeti remains

        // Check Wisp destruction
        expect(cardD.child.dispose.status).toBe(true);
        expect(cardD.child.dispose.refer.source).toBe(cardC);

        // Check Chillwind Yeti destruction
        expect(cardE.child.dispose.status).toBe(false);
        
    });
});
