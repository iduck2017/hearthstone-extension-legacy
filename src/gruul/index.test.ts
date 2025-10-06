/**
 * Test cases for Gruul
 * 
 * Initial state: Player A has Gruul in hand.
 * Player B has empty board.
 * 
 * 1. gruul-play: Player A plays Gruul.
 * 2. gruul-growth: End of turn, Gruul gains +1/+1.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { GruulModel } from "./index";
import { boot } from "../boot";

describe('gruul', () => {
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
                            minions: [new GruulModel()],
                            spells: []
                        }
                    })),
                    deck: new DeckModel(() => ({
                        child: { minions: [] }
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
    const cardC = handA.refer.order.find(item => item instanceof GruulModel);
    if (!cardC) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;

    test('gruul-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(7); // Gruul: 7/7
        expect(roleC.child.health.state.current).toBe(7);
        expect(handA.refer.order.length).toBe(1); // Gruul in hand
        expect(boardA.refer.order.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Gruul
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Gruul should be on board
        expect(boardA.refer.order.length).toBe(1); // Gruul on board
        expect(handA.refer.order.length).toBe(0); // Gruul moved to board
        expect(playerA.child.mana.state.current).toBe(2); // 10 - 8 = 2
    });

    test('turn-end', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(7); // Gruul: 7/7
        expect(roleC.child.health.state.current).toBe(7);
        expect(boardA.refer.order.length).toBe(1); // Gruul on board

        // End Player A's turn
        game.child.turn.next();

        // Gruul should have grown by +1/+1
        expect(roleC.child.attack.state.current).toBe(8); // Gruul: 8/8
        expect(roleC.child.health.state.current).toBe(8);
    });

    test('turn-end', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(8); // Gruul: 8/8
        expect(roleC.child.health.state.current).toBe(8);
        expect(boardA.refer.order.length).toBe(1); // Gruul on board

        // End Player B's turn
        game.child.turn.next();

        // Gruul should have grown by +1/+1 again
        expect(roleC.child.attack.state.current).toBe(9); // Gruul: 9/9
        expect(roleC.child.health.state.current).toBe(9);
    });

});
