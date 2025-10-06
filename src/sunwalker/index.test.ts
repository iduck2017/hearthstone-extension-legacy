/**
 * Test cases for Sunwalker
 * 
 * Initial state: Player A has Sunwalker in hand.
 * Player B has a Wisp on board.
 * 
 * 1. sunwalker-play: Player A plays Sunwalker.
 * 2. wisp-attack: Player B's Wisp cannot attack Player A's hero due to Sunwalker's Taunt.
 * 3. divine-shield-test: Sunwalker's Divine Shield blocks damage.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { SunwalkerModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('sunwalker', () => {
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
                            minions: [new SunwalkerModel()],
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
                        child: { spells: [] }
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
    const cardC = handA.refer.order.find(item => item instanceof SunwalkerModel);
    const cardD = boardB.refer.order.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('sunwalker-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(4); // Sunwalker: 4/5
        expect(roleC.child.health.state.current).toBe(5);
        expect(handA.refer.order.length).toBe(1); // Sunwalker in hand
        expect(boardA.refer.order.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Sunwalker
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Sunwalker should be on board
        expect(boardA.refer.order.length).toBe(1); // Sunwalker on board
        expect(handA.refer.order.length).toBe(0); // Sunwalker moved to board
        expect(playerA.child.mana.state.current).toBe(4); // 10 - 6 = 4

        // Check that Sunwalker has Taunt and Divine Shield
        expect(roleC.child.feats.child.taunt.state.isActive).toBe(true); // Has Taunt
        expect(roleC.child.feats.child.divineShield.state.isActive).toBe(true); // Has Divine Shield
    });

    test('wisp-attack', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check that Wisp cannot attack hero due to Sunwalker's Taunt
        expect(boardA.refer.order.length).toBe(1); // Sunwalker on board
        expect(boardB.refer.order.length).toBe(1); // Wisp on board
        expect(roleD.child.attack.state.current).toBe(1); // Wisp: 1/1
        expect(roleD.child.health.state.current).toBe(1);

        // Try to attack with Wisp
        const promise = roleD.child.action.run();
        expect(SelectUtil.current?.options).not.toContain(roleA); // Cannot target enemy hero
        expect(SelectUtil.current?.options).toContain(roleC); // Must target Sunwalker due to Taunt
        SelectUtil.set(roleC); // Target Sunwalker
        await promise;

        // Sunwalker should take 1 damage but Divine Shield should block it
        expect(roleC.child.health.state.current).toBe(5); // Still 5 health (Divine Shield blocked damage)
        expect(roleC.child.feats.child.divineShield.state.isActive).toBe(false); // Divine Shield consumed
    });
});
