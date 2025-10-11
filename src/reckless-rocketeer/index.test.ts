/**
 * Test cases for Reckless Rocketeer
 * 
 * Initial state: Player A has Reckless Rocketeer in hand.
 * Player B has a Wisp on board.
 * 
 * 1. reckless-rocketeer-play: Player A plays Reckless Rocketeer.
 * 2. reckless-rocketeer-charge: Player A's Reckless Rocketeer immediately attacks Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { RecklessRocketeerModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('reckless-rocketeer', () => {
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
                            minions: [new RecklessRocketeerModel()],
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
                        child: { minions: [new WispModel()]}
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
    const cardC = handA.refer.queue.find(item => item instanceof RecklessRocketeerModel);
    const cardD = boardB.refer.queue.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('reckless-rocketeer-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(5); // Reckless Rocketeer: 5/2
        expect(roleC.child.health.state.current).toBe(2);
        expect(handA.refer.queue.length).toBe(1); // Reckless Rocketeer in hand
        expect(boardA.refer.queue.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Reckless Rocketeer
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Reckless Rocketeer should be on board
        expect(boardA.refer.queue.length).toBe(1); // Reckless Rocketeer on board
        expect(handA.refer.queue.length).toBe(0); // Reckless Rocketeer moved to board
        expect(playerA.child.mana.state.current).toBe(4); // 10 - 6 = 4

        // Check that Reckless Rocketeer has Charge (can attack immediately)
        expect(roleC.child.action.state.current).toBe(1); // Can attack
        expect(roleC.child.action.status).toBe(true); // Action is available
    });

    test('reckless-rocketeer-charge', async () => {
        // Check initial state
        expect(roleB.child.health.state.current).toBe(30); // Player B hero: 30 health
        expect(roleC.child.attack.state.current).toBe(5); // Reckless Rocketeer: 5/2
        expect(roleC.child.health.state.current).toBe(2);
        expect(roleC.child.action.state.current).toBe(1); // Can attack
        expect(roleC.child.action.status).toBe(true); // Action is available

        // Reckless Rocketeer attacks Player B's hero
        const promise = roleC.child.action.run();
        expect(SelectUtil.current?.options).toContain(roleB); // Can target enemy hero
        expect(SelectUtil.current?.options).toContain(roleD); // Can target enemy minion
        SelectUtil.set(roleB); // Target Player B's hero
        await promise;

        // Player B's hero should take 5 damage
        expect(roleB.child.health.state.current).toBe(25); // 30 - 5 = 25
        expect(roleB.child.health.state.damage).toBe(5);

        // Reckless Rocketeer should have used its attack
        expect(roleC.child.action.state.current).toBe(0); // Cannot attack again this turn
    });
});
