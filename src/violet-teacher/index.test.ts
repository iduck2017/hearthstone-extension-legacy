/**
 * Test cases for Violet Teacher
 * 
 * Initial state: Player A has Violet Teacher on board and Fireball in hand.
 * Player B has empty board.
 * 
 * 1. violet-teacher-play: Player A plays Violet Teacher.
 * 2. spell-cast: Player A casts Fireball, summoning a Violet Apprentice.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { VioletTeacherModel } from "./index";
import { VioletApprenticeModel } from "../violet-apprentice";
import { FireballModel } from "../fireball";
import { boot } from "../boot";

describe('violet-teacher', () => {
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
                            minions: [new VioletTeacherModel()],
                            spells: [new FireballModel()]
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
    const cardC = handA.refer.queue?.find(item => item instanceof VioletTeacherModel);
    const cardD = handA.refer.queue?.find(item => item instanceof FireballModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;

    test('violet-teacher-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(3); // Violet Teacher: 3/5
        expect(roleC.child.health.state.current).toBe(5);
        expect(handA.refer.queue?.length).toBe(2); // Violet Teacher + Fireball in hand
        expect(boardA.refer.queue?.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Violet Teacher
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Violet Teacher should be on board
        expect(boardA.refer.queue?.length).toBe(1); // Violet Teacher on board
        expect(handA.refer.queue?.length).toBe(1); // Fireball remaining in hand
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6
    });

    test('spell-cast', async () => {
        // Check initial state
        expect(boardA.refer.queue?.length).toBe(1); // Violet Teacher on board
        expect(handA.refer.queue?.length).toBe(1); // Fireball in hand
        expect(playerA.child.mana.state.current).toBe(6);

        // Cast Fireball
        let promise = cardD.play();
        expect(SelectUtil.current?.options).toContain(roleA); // Can target friendly hero
        expect(SelectUtil.current?.options).toContain(roleB); // Can target enemy hero
        SelectUtil.set(roleB); // Target Player B's hero
        await promise;

        // Violet Apprentice should be summoned
        expect(boardA.refer.queue?.length).toBe(2); // Violet Teacher + Violet Apprentice on board
        expect(handA.refer.queue?.length).toBe(0); // Fireball used
        expect(playerA.child.mana.state.current).toBe(2); // 6 - 4 = 2

        // Check that Violet Apprentice was summoned
        const cardF = boardA.refer.queue?.find(item => item instanceof VioletApprenticeModel);
        expect(cardF).toBeDefined(); // Should have summoned a Violet Apprentice
        const roleF = cardF?.child.role;
        if (!roleF) throw new Error();
        expect(roleF.child.attack.state.current).toBe(1); // Violet Apprentice: 1/1
        expect(roleF.child.health.state.current).toBe(1);

        expect(boardA.refer.order[0]).toBe(cardC);
        expect(boardA.refer.order[1]).toBe(cardF);
    });
});
