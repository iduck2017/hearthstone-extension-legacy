/**
 * Test cases for Novice Engineer
 * 
 * Initial state: Player A has Novice Engineer in hand and 2 cards in deck.
 * Player B has empty board.
 * 
 * 1. novice-engineer-play: Player A plays Novice Engineer, drawing a card.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { NoviceEngineerModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('novice-engineer', () => {
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
                            minions: [new NoviceEngineerModel()],
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
    const cardC = handA.refer.order.find(item => item instanceof NoviceEngineerModel);
    if (!cardC) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;

    test('novice-engineer-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(1); // Novice Engineer: 1/1
        expect(roleC.child.health.state.current).toBe(1);
        expect(boardA.refer.order.length).toBe(0); // No minions on board
        expect(handA.refer.order.length).toBe(1); // Novice Engineer in hand
        expect(deckA.refer.order.length).toBe(2); // 2 Wisp in deck
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Novice Engineer
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Novice Engineer should be on board
        expect(boardA.refer.order.length).toBe(1); // Novice Engineer on board
        expect(handA.refer.order.length).toBe(1); // 1 card drawn from deck (2 - 1 = 1)
        expect(deckA.refer.order.length).toBe(1); // 1 Wisp remaining in deck
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 = 8
    });
});
