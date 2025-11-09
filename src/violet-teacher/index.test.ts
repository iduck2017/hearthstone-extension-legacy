/**
 * Test cases for Violet Teacher
 * 
 * Initial state: Player A has Violet Teacher on board and Fireball in hand.
 * Player B has empty board.
 * 
 * 1. violet-teacher-play: Player A plays Violet Teacher.
 * 2. spell-cast: Player A casts Fireball, summoning a Violet Apprentice.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { VioletTeacherModel } from "./index";
import { VioletApprenticeModel } from "../violet-apprentice";
import { FireballModel } from "../fireball";
import { boot } from "../boot";
import { FrostboltModel } from "../frostbolt";

describe('violet-teacher', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: []
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new VioletTeacherModel(), new FireballModel(), new FrostboltModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { cards: [] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: []
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: []
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
    const handA = playerA.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof VioletTeacherModel);
    const cardD = handA.child.cards.find(item => item instanceof FireballModel);
    const cardE = handA.child.cards.find(item => item instanceof FrostboltModel);
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;
    if (!cardC || !cardD || !cardE) throw new Error();


    test('frostbolt-play', async () => {
        // Check initial state
        expect(handA.child.cards.length).toBe(3); // Violet Teacher + Fireball + Frostbolt in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Cast Frostbolt
        let promise = cardE.play();
        expect(playerA.child.controller.current?.options).toContain(heroA); // Can target friendly hero
        expect(playerA.child.controller.current?.options).toContain(heroB); // Can target enemy hero
        playerA.child.controller.set(heroB); // Target Player B's hero
        await promise;

        // No minions should be summoned (Violet Teacher not on board yet)
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(handA.child.cards.length).toBe(2); // Violet Teacher + Fireball remaining in hand
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 = 8
    })

    test('violet-teacher-play', async () => {
        // Check state after frostbolt-play (Frostbolt was used, mana = 8)
        expect(cardC.child.attack.state.current).toBe(3); // Violet Teacher: 3/5
        expect(cardC.child.health.state.current).toBe(5);
        expect(handA.child.cards.length).toBe(2); // Violet Teacher + Fireball in hand (Frostbolt was used)
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 = 8 (after Frostbolt)

        // Play Violet Teacher
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Violet Teacher should be on board
        expect(boardA.child.cards.length).toBe(1); // Violet Teacher on board
        expect(handA.child.cards.length).toBe(1); // Fireball remaining in hand
        expect(playerA.child.mana.state.current).toBe(4); // 8 - 4 = 4
    });

    test('spell-cast', async () => {
        // Check state after violet-teacher-play (Violet Teacher is on board, mana = 4)
        expect(boardA.child.cards.length).toBe(1); // Violet Teacher on board
        expect(handA.child.cards.length).toBe(1); // Fireball in hand
        expect(playerA.child.mana.state.current).toBe(4); // 8 - 4 = 4 (after playing Violet Teacher)

        // Cast Fireball
        let promise = cardD.play();
        expect(playerA.child.controller.current?.options).toContain(heroA); // Can target friendly hero
        expect(playerA.child.controller.current?.options).toContain(heroB); // Can target enemy hero
        playerA.child.controller.set(heroB); // Target Player B's hero
        await promise;

        // Violet Apprentice should be summoned
        expect(boardA.child.cards.length).toBe(2); // Violet Teacher + Violet Apprentice on board
        expect(handA.child.cards.length).toBe(0); // Fireball used
        expect(playerA.child.mana.state.current).toBe(0); // 4 - 4 = 0

        // Check that Violet Apprentice was summoned
        const cardF = boardA.child.cards.find(item => item instanceof VioletApprenticeModel);
        expect(cardF).toBeDefined(); // Should have summoned a Violet Apprentice
        if (!cardF) throw new Error();
        expect(cardF.child.attack.state.current).toBe(1); // Violet Apprentice: 1/1
        expect(cardF.child.health.state.current).toBe(1);

        expect(boardA.child.cards[0]).toBe(cardC);
        expect(boardA.child.cards[1]).toBe(cardF);
    });
});
