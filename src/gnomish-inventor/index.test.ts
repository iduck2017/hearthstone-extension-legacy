/**
 * Test cases for Gnomish Inventor
 * 
 * Initial state: Player A has Gnomish Inventor in hand and 2 cards in deck.
 * Player B has empty board.
 * 
 * 1. gnomish-inventor-play: Player A plays Gnomish Inventor, drawing a card.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { GnomishInventorModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('gnomish-inventor', () => {
    const game = new GameModel(() => ({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { 
                            minions: []
                        }
                    })),
                    hand: new HandModel(() => ({
                        child: { 
                            minions: [new GnomishInventorModel()],
                            spells: []
                        }
                    })),
                    deck: new DeckModel(() => ({
                        child: { minions: [new WispModel(), new WispModel()] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { 
                            minions: []
                        }
                    })),
                    hand: new HandModel(() => ({
                        child: { 
                            minions: [],
                            spells: []
                        }
                    }))
                }
            }))
        }
    }));
    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const handA = playerA.child.hand;
    const deckA = playerA.child.deck;
    const cardC = handA.refer.order.find(item => item instanceof GnomishInventorModel);
    if (!cardC) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;

    test('gnomish-inventor-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(2); // Gnomish Inventor: 2/4
        expect(roleC.child.health.state.current).toBe(4);
        expect(handA.refer.order.length).toBe(1); // Gnomish Inventor in hand
        expect(deckA.refer.order.length).toBe(2); // 2 Wisp in deck
        expect(boardA.refer.order.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Gnomish Inventor
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Gnomish Inventor should be on board
        expect(boardA.refer.order.length).toBe(1); // Gnomish Inventor on board
        expect(handA.refer.order.length).toBe(1); // 1 card drawn from deck (2 - 1 = 1)
        expect(deckA.refer.order.length).toBe(1); // 1 Wisp remaining in deck
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6
    });
});
