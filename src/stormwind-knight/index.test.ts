/**
 * Test cases for Stormwind Knight
 * 
 * Initial state: Player A has Stormwind Knight in hand.
 * Player B has a Wisp on board.
 * 
 * 1. stormwind-knight-play: Player A plays Stormwind Knight.
 * 2. stormwind-knight-attack: Player A's Stormwind Knight attacks Player B's Wisp immediately (Charge).
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { StormwindKnightModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('stormwind-knight', () => {
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
                            minions: [new StormwindKnightModel()],
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
                            minions: [new WispModel()]
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
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    const cardC = handA.refer.order.find(item => item instanceof StormwindKnightModel);
    const cardD = boardB.refer.order.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('stormwind-knight-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(2); // Stormwind Knight: 2/5
        expect(roleC.child.health.state.current).toBe(5);
        expect(handA.refer.order.length).toBe(1); // Stormwind Knight in hand
        expect(boardA.refer.order.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Stormwind Knight
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Stormwind Knight should be on board
        expect(boardA.refer.order.length).toBe(1); // Stormwind Knight on board
        expect(handA.refer.order.length).toBe(0); // Stormwind Knight moved to board
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6

        // Check that Stormwind Knight has Charge
        expect(roleC.child.feats.child.charge.state.isActive).toBe(true); // Has Charge
    });

    test('stormwind-knight-attack', async () => {
        // Check initial state
        expect(roleC.child.health.state.current).toBe(5); // Stormwind Knight: 2/5
        expect(roleD.child.health.state.current).toBe(1); // Wisp: 1/1
        expect(boardA.refer.order.length).toBe(1); // Stormwind Knight on board
        expect(boardB.refer.order.length).toBe(1); // Wisp on board

        // Player A's Stormwind Knight attacks Player B's Wisp immediately (Charge allows immediate attack)
        let promise = roleC.child.action.run();
        expect(SelectUtil.current?.options).toContain(roleD); // Can target Wisp
        expect(SelectUtil.current?.options).toContain(roleB); // Can target Player B's hero
        SelectUtil.set(roleD); // Target Wisp
        await promise;

        // Wisp should die (1/1 vs 2/5)
        expect(boardB.refer.order.length).toBe(0); // Wisp dies
        expect(cardD.child.dispose.refer.source).toBe(cardC);
        expect(cardD.child.dispose.status).toBe(true);
        
        expect(roleC.child.health.state.current).toBe(4); // Stormwind Knight: 5 - 1 = 4
    });
});
