/**
 * Test cases for Flame Imp
 * 
 * Initial state: Player A has Flame Imp in hand.
 * Player B has empty board.
 * 
 * 1. flame-imp-play: Player A plays Flame Imp, dealing 3 damage to himself.
 * 2. flame-imp-attack: Player A's Flame Imp attacks Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { FlameImpModel } from "./index";
import { boot } from "../boot";

describe('flame-imp', () => {
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
                            minions: [new FlameImpModel()],
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
                            minions: []
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
    const handA = playerA.child.hand;
    const cardC = handA.refer.queue.find(item => item instanceof FlameImpModel);
    if (!cardC) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;

    test('flame-imp-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(3); // Flame Imp: 3/2
        expect(roleC.child.health.state.current).toBe(2);
        expect(handA.refer.queue.length).toBe(1); // Flame Imp in hand
        expect(boardA.refer.queue.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana
        expect(roleA.child.health.state.current).toBe(30); // Player A hero: 30 health

        // Play Flame Imp
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Flame Imp should be on board
        expect(boardA.refer.queue.length).toBe(1); // Flame Imp on board
        expect(handA.refer.queue.length).toBe(0); // Flame Imp moved to board
        expect(playerA.child.mana.state.current).toBe(9); // 10 - 1 = 9

        // Player A's hero should take 3 damage from battlecry
        expect(roleA.child.health.state.current).toBe(27); // Player A hero: 30 - 3 = 27
        expect(roleA.child.health.state.damage).toBe(3);
    });
});
