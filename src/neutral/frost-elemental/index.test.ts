/**
 * Test cases for Frost Elemental
 * 
 * Initial state: Player A has Frost Elemental in hand.
 * Player B has a minion on board.
 * 
 * 1. frost-elemental-play: Player A plays Frost Elemental, freezing a target.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { FrostElementalModel } from "./index";
import { WispModel } from '../../neutral/wisp';
import { boot } from '../../boot';

describe('frost-elemental', () => {
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
                            cards: [new FrostElementalModel()]
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
                            cards: [new WispModel()]
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
    const cardC = handA.child.cards.find(item => item instanceof FrostElementalModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;

    test('frost-elemental-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(5); // Frost Elemental: 5/5
        expect(cardC.child.health.state.current).toBe(5);
        expect(cardD.child.attack.state.current).toBe(1); // Wisp: 1/1
        expect(cardD.child.health.state.current).toBe(1);
        expect(handA.child.cards.length).toBe(1); // Frost Elemental in hand
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Frost Elemental
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await AnimeUtil.sleep();
        expect(playerA.child.controller.current?.options).toContain(heroA); // Can target friendly hero
        expect(playerA.child.controller.current?.options).toContain(heroB); // Can target enemy hero
        expect(playerA.child.controller.current?.options).toContain(cardD); // Can target enemy minion
        playerA.child.controller.set(cardD); // Target Wisp
        await promise;

        // Wisp should be frozen
        expect(cardD.child.feats.child.frozen.state.isActive).toBe(true);

        // Frost Elemental should be on board
        expect(boardA.child.cards.length).toBe(1); // Frost Elemental on board
        expect(handA.child.cards.length).toBe(0); // Frost Elemental moved to board
        expect(playerA.child.mana.state.current).toBe(4); // 10 - 6 = 4
    });
});
