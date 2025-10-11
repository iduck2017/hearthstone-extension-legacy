/**
 * Test cases for Demolisher
 * 
 * Initial state: Player A has empty board.
 * Player B has Demolisher on board.
 * 
 * 1. demolisher-hook: Turn ends, Demolisher triggers, Player A health becomes 28.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { DemolisherModel } from "./index";
import { boot } from "../boot";

describe('demolisher', () => {
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
                            minions: [],
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
                            minions: [new DemolisherModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            minions: [],
                            spells: []
                        }
                    }),
                    deck: new DeckModel({
                        child: { minions: [] }
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
    const cardC = boardB.refer.queue?.find(item => item instanceof DemolisherModel);
    if (!cardC) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;

    test('demolisher-hook', async () => {
        // Check initial state
        expect(boardA.refer.queue?.length).toBe(0); // Player A has empty board
        expect(boardB.refer.queue?.length).toBe(1); // Player B has Demolisher on board
        expect(roleA.child.health.state.current).toBe(30); // Player A hero: 30 health
        
        // End turn to trigger Demolisher's start turn effect
        game.child.turn.next();
        await TimeUtil.sleep();
        
        // Check that Player A's health is reduced by 2
        expect(roleA.child.health.state.current).toBe(28); // Player A hero: 30 - 2 = 28
        expect(roleA.child.health.state.damage).toBe(2);
    });
}) 