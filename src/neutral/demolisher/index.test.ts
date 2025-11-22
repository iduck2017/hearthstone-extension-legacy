/**
 * Test cases for Demolisher
 * 
 * Initial state: Player A has empty board.
 * Player B has Demolisher on board.
 * 
 * 1. demolisher-hook: Turn ends, Demolisher triggers, Player A health becomes 28.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { DemolisherModel } from "./index";
import { boot } from '../../boot';

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
                            cards: []
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: []
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
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new DemolisherModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { cards: [] }
                    })
                }
            })
        }
    });
    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const handB = playerB.child.hand;
    const boardB = playerB.child.board;
    const cardC = handB.child.cards.find(item => item instanceof DemolisherModel);
    if (!cardC) throw new Error();
    const heroA = playerA.child.hero;

    test('turn-next', async () => {
        // playerA
        expect(heroA.child.health.state.current).toBe(30); // Player A hero: 30 health
        // playerB
        game.child.turn.next();
        expect(heroA.child.health.state.current).toBe(30); // Player A hero: 30 health
    })


    test('demolisher-trigger', async () => {
        // playerB
        expect(boardA.child.cards.length).toBe(0); // Player A has empty board
        expect(boardB.child.cards.length).toBe(0); // Player B has Demolisher on board

        const promise = cardC.play();
        await CommonUtil.sleep()
        const selector = playerB.controller.current;    
        expect(selector?.options).toContain(0);
        playerB.controller.set(0);
        await promise;

        expect(boardA.child.cards.length).toBe(0)
        expect(boardB.child.cards.length).toBe(1); // Player B has Demolisher on board

        // Check initial state
        expect(heroA.child.health.state.current).toBe(30); // Player A hero: 30 health
        
        // End turn to trigger Demolisher's start turn effect
        // playerA
        game.child.turn.next();
        expect(heroA.child.health.state.current).toBe(30); // Player A hero: 30 health
        // playerB
        game.child.turn.next();
        await CommonUtil.sleep();
        
        // Check that Player A's health is reduced by 2
        expect(heroA.child.health.state.current).toBe(28); // Player A hero: 30 - 2 = 28
        expect(heroA.child.health.state.damage).toBe(2);
    });
}) 