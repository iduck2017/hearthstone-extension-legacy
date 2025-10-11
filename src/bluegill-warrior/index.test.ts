/**
 * Test cases for Bluegill Warrior
 * 
 * Initial state: Player A has Bluegill Warrior in hand.
 * Player B has a Wisp on board.
 * 
 * 1. bluegill-warrior-play: Player A plays Bluegill Warrior.
 * 2. bluegill-warrior-charge: Player A's Bluegill Warrior immediately attacks Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { BluegillWarriorModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('bluegill-warrior', () => {
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
                            minions: [new BluegillWarriorModel()],
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
                        child: { spells: [] }
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
    const cardC = handA.refer.queue.find(item => item instanceof BluegillWarriorModel);
    const cardD = boardB.refer.queue.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('bluegill-warrior-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(2); // Bluegill Warrior: 2/1
        expect(roleC.child.health.state.current).toBe(1);
        expect(handA.refer.queue.length).toBe(1); // Bluegill Warrior in hand
        expect(boardA.refer.queue.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Bluegill Warrior
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Bluegill Warrior should be on board
        expect(boardA.refer.queue.length).toBe(1); // Bluegill Warrior on board
        expect(handA.refer.queue.length).toBe(0); // Bluegill Warrior moved to board
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 = 8

        // Check that Bluegill Warrior has Charge (can attack immediately)
        expect(roleC.child.action.state.current).toBe(1); // Can attack
        expect(roleC.child.action.status).toBe(true); // Action is available
    });

    test('bluegill-warrior-charge', async () => {
        // Check initial state
        expect(roleB.child.health.state.current).toBe(30); // Player B hero: 30 health
        expect(roleC.child.attack.state.current).toBe(2); // Bluegill Warrior: 2/1
        expect(roleC.child.health.state.current).toBe(1);
        expect(roleC.child.action.state.current).toBe(1); // Can attack
        expect(roleC.child.action.status).toBe(true); // Action is available

        // Bluegill Warrior attacks Player B's hero
        const promise = roleC.child.action.run();
        expect(SelectUtil.current?.options).toContain(roleB); // Can target enemy hero
        expect(SelectUtil.current?.options).toContain(roleD); // Can target enemy minion
        SelectUtil.set(roleB); // Target Player B's hero
        await promise;

        // Player B's hero should take 2 damage
        expect(roleB.child.health.state.current).toBe(28); // 30 - 2 = 28
        expect(roleB.child.health.state.damage).toBe(2);

        // Bluegill Warrior should have used its attack
        expect(roleC.child.action.state.current).toBe(0); // Cannot attack again this turn
    });
});
