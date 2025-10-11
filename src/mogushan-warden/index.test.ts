/**
 * Test cases for Mogu'shan Warden
 * 
 * Initial state: Player A has Mogu'shan Warden in hand.
 * Player B has a Wisp on board.
 * 
 * 1. mogushan-warden-play: Player A plays Mogu'shan Warden.
 * 2. taunt-test: Player B's Wisp must attack Mogu'shan Warden due to Taunt.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { MogushanWardenModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('mogushan-warden', () => {
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
                            minions: [new MogushanWardenModel()],
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
    const cardC = handA.refer.queue.find(item => item instanceof MogushanWardenModel);
    const cardD = boardB.refer.queue.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('mogushan-warden-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(1); // Mogu'shan Warden: 1/7
        expect(roleC.child.health.state.current).toBe(7);
        expect(handA.refer.queue.length).toBe(1); // Mogu'shan Warden in hand
        expect(boardA.refer.queue.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Mogu'shan Warden
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Mogu'shan Warden should be on board
        expect(boardA.refer.queue.length).toBe(1); // Mogu'shan Warden on board
        expect(handA.refer.queue.length).toBe(0); // Mogu'shan Warden moved to board
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6

        // Check that Mogu'shan Warden has Taunt
        expect(roleC.child.feats.child.taunt).toBeDefined(); // Has Taunt
    });

    test('wisp-attack', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(roleC.child.health.state.current).toBe(7); // Mogu'shan Warden: 1/7
        expect(roleD.child.health.state.current).toBe(1); // Wisp: 1/1
        expect(boardA.refer.queue.length).toBe(1); // Mogu'shan Warden on board
        expect(boardB.refer.queue.length).toBe(1); // Wisp on board

        // Player B's Wisp attacks - should be forced to target Mogu'shan Warden due to Taunt
        let promise = roleD.child.action.run();
        expect(SelectUtil.current?.options).toContain(roleC); // Can target Mogu'shan Warden (Taunt)
        expect(SelectUtil.current?.options).not.toContain(roleA); // Cannot target Player A's hero (Taunt blocks)
        SelectUtil.set(roleC); // Target Mogu'shan Warden
        await promise;

        // Both minions should take damage
        expect(roleC.child.health.state.current).toBe(6); // Mogu'shan Warden: 7 - 1 = 6
        expect(roleD.child.health.state.current).toBe(0); // Wisp: 1 - 1 = 0 (dies)
        expect(boardB.refer.queue.length).toBe(0); // Wisp dies
    });
});
