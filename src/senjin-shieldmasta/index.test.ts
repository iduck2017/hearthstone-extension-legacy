/**
 * Test cases for Sen'jin Shieldmasta
 * 
 * Initial state: Player A has Sen'jin Shieldmasta in hand.
 * Player B has a Wisp on board.
 * 
 * 1. senjin-shieldmasta-play: Player A plays Sen'jin Shieldmasta.
 * 2. taunt-test: Player B's Wisp must attack Sen'jin Shieldmasta due to Taunt.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { SenjinShieldmastaModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('senjin-shieldmasta', () => {
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
                            minions: [new SenjinShieldmastaModel()],
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
    const cardC = handA.refer.queue.find(item => item instanceof SenjinShieldmastaModel);
    const cardD = boardB.refer.queue.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('senjin-shieldmasta-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(3); // Sen'jin Shieldmasta: 3/5
        expect(roleC.child.health.state.current).toBe(5);
        expect(handA.refer.queue.length).toBe(1); // Sen'jin Shieldmasta in hand
        expect(boardA.refer.queue.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Sen'jin Shieldmasta
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Sen'jin Shieldmasta should be on board
        expect(boardA.refer.queue.length).toBe(1); // Sen'jin Shieldmasta on board
        expect(handA.refer.queue.length).toBe(0); // Sen'jin Shieldmasta moved to board
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6

        // Check that Sen'jin Shieldmasta has Taunt
        expect(roleC.child.feats.child.taunt).toBeDefined(); // Has Taunt
    });

    test('taunt-test', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(roleC.child.health.state.current).toBe(5); // Sen'jin Shieldmasta: 3/5
        expect(roleD.child.health.state.current).toBe(1); // Wisp: 1/1
        expect(boardA.refer.queue.length).toBe(1); // Sen'jin Shieldmasta on board
        expect(boardB.refer.queue.length).toBe(1); // Wisp on board

        // Player B's Wisp attacks - should be forced to target Sen'jin Shieldmasta due to Taunt
        let promise = roleD.child.action.run();
        expect(playerB.child.controller.current?.options).toContain(roleC); // Can target Sen'jin Shieldmasta (Taunt)
        expect(playerB.child.controller.current?.options).not.toContain(roleA); // Cannot target Player A's hero (Taunt blocks)
        playerB.child.controller.set(roleC); // Target Sen'jin Shieldmasta
        await promise;

        // Both minions should take damage
        expect(roleC.child.health.state.current).toBe(4); // Sen'jin Shieldmasta: 5 - 1 = 4
        expect(roleD.child.health.state.current).toBe(-2); // Wisp: 1 - 3 = 0 (dies)
        expect(boardB.refer.queue.length).toBe(0); // Wisp dies
    });
});
