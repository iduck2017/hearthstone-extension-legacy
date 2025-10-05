/**
 * Test cases for Lord of the Arena
 * 
 * Initial state: Player A has Lord of the Arena in hand.
 * Player B has a minion on board.
 * 
 * 1. lord-arena-play: Player A plays Lord of the Arena.
 * 2. wisp-attack: Player B's Wisp cannot attack Player A's hero due to Lord of the Arena's Taunt.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { LordOfTheArenaModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('lord-of-the-arena', () => {
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
                            minions: [new LordOfTheArenaModel()],
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
    const cardC = handA.child.minions.find(item => item instanceof LordOfTheArenaModel);
    const cardD = boardB.child.minions.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('lord-arena-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(6); // Lord of the Arena: 6/5
        expect(roleC.child.health.state.current).toBe(5);
        expect(handA.child.minions.length).toBe(1); // Lord of the Arena in hand
        expect(boardA.child.minions.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Lord of the Arena
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Lord of the Arena should be on board
        expect(boardA.child.minions.length).toBe(1); // Lord of the Arena on board
        expect(handA.child.minions.length).toBe(0); // Lord of the Arena moved to board
        expect(playerA.child.mana.state.current).toBe(4); // 10 - 6 = 4
    });

    test('wisp-attack', async () => {
        const turn = game.child.turn;
        turn.next();
        expect(turn.refer.current).toBe(playerB);

        // Check that Wisp cannot attack hero due to Lord of the Arena's Taunt
        expect(boardA.child.minions.length).toBe(1); // Lord of the Arena on board
        expect(boardB.child.minions.length).toBe(1); // Wisp on board
        expect(roleD.child.attack.state.current).toBe(1); // Wisp: 1/1
        expect(roleD.child.health.state.current).toBe(1);

        // Try to attack with Wisp
        const promise = roleD.child.action.run();
        expect(SelectUtil.current?.options).not.toContain(roleA); // Can target enemy hero
        expect(SelectUtil.current?.options).toContain(roleC); // Must target Lord of the Arena due to Taunt
        SelectUtil.set(roleC); // Target Lord of the Arena
        await promise;

        // Lord of the Arena should take 1 damage
        expect(roleC.child.health.state.current).toBe(4); // 5 - 1 = 4
    });
});
