/**
 * Test cases for Wolfrider
 * 
 * Initial state: Player A has Wolfrider in hand.
 * Player B has a Wisp on board.
 * 
 * 1. wolfrider-play: Player A plays Wolfrider.
 * 2. wolfrider-attack: Player A's Wolfrider attacks Player B's Wisp immediately (Charge).
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { WolfriderModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('wolfrider', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            minions: []
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            minions: [new WolfriderModel()],
                            spells: []
                        }
                    }),
                    deck: new DeckModel({
                        child: { minions: [] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            minions: [new WispModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            minions: [],
                            spells: []
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
    const cardC = handA.refer.queue.find(item => item instanceof WolfriderModel);
    const cardD = boardB.refer.queue.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('wolfrider-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(3); // Wolfrider: 3/1
        expect(roleC.child.health.state.current).toBe(1);
        expect(handA.refer.queue.length).toBe(1); // Wolfrider in hand
        expect(boardA.refer.queue.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Wolfrider
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Wolfrider should be on board
        expect(boardA.refer.queue.length).toBe(1); // Wolfrider on board
        expect(handA.refer.queue.length).toBe(0); // Wolfrider moved to board
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 = 7

        // Check that Wolfrider has Charge
        expect(cardC.child.role.child.feats.child.charge.state.isActive).toBe(true); // Has Charge
    });

    test('wolfrider-attack', async () => {
        // Check initial state
        expect(roleC.child.health.state.current).toBe(1); // Wolfrider: 3/1
        expect(roleD.child.health.state.current).toBe(1); // Wisp: 1/1
        expect(boardA.refer.queue.length).toBe(1); // Wolfrider on board
        expect(boardB.refer.queue.length).toBe(1); // Wisp on board

        // Player A's Wolfrider attacks Player B's Wisp immediately (Charge allows immediate attack)
        let promise = roleC.child.action.run();
        expect(SelectUtil.current?.options).toContain(roleD); // Can target Wisp
        expect(SelectUtil.current?.options).toContain(roleB); // Can target Player B's hero
        SelectUtil.set(roleD); // Target Wisp
        await promise;

        // Wisp should die (1/1 vs 3/1)
        expect(boardB.refer.queue.length).toBe(0); // Wisp dies
        expect(roleC.child.health.state.current).toBe(0); // Wolfrider: 1 - 1 = 0 (dies)

        expect(cardD.child.dispose.status).toBe(true);
        expect(roleD.child.health.state.damage).toBe(3);
        expect(roleD.child.health.state.current).toBe(-2);

        expect(boardA.refer.queue.length).toBe(0); // Wolfrider dies
    });
});
