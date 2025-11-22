/**
 * Test cases for Young Dragonhawk
 * 
 * Initial state: Player A has Young Dragonhawk on board.
 * Player B has Shieldbearer on board.
 * 
 * 1. young-dragonhawk-windfury: Player A's Young Dragonhawk attacks Player B's Shieldbearer twice.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { YoungDragonhawkModel } from "./index";
import { ShieldbearerModel } from "../shieldbearer";
import { boot } from '../../boot';

describe('young-dragonhawk', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new YoungDragonhawkModel()]
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
                            cards: [new ShieldbearerModel()]
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
    const boardB = playerB.child.board;
    const cardC = boardA.child.cards.find(item => item instanceof YoungDragonhawkModel);
    const cardD = boardB.child.cards.find(item => item instanceof ShieldbearerModel);
    if (!cardC || !cardD) throw new Error();

    test('young-dragonhawk-windfury', async () => {
        // Check initial state
        expect(boardA.child.cards.length).toBe(1); // Young Dragonhawk on board
        expect(boardB.child.cards.length).toBe(1); // Shieldbearer on board
        expect(cardC.child.action.state.origin).toBe(2); // Windfury: 2 attacks
        expect(cardC.child.action.state.current).toBe(2);
        expect(cardD.child.health.state.current).toBe(4); // Shieldbearer: 4 health
        
        // First attack
        let promise = cardC.child.action.run();
        await AnimeUtil.sleep();
        expect(playerA.controller.current?.options).toContain(cardD); // Can target Shieldbearer
        expect(playerA.controller.current?.options.length).toBe(1);
        playerA.controller.set(cardD); // Target Shieldbearer
        await promise;
        
        // After first attack
        expect(cardC.child.action.state.origin).toBe(2);
        expect(cardC.child.action.state.current).toBe(1); // 1 attack remaining
        expect(cardD.child.health.state.current).toBe(3); // Shieldbearer: 4 - 1 = 3
        
        // Second attack
        promise = cardC.child.action.run();
        await AnimeUtil.sleep();
        expect(playerA.controller.current?.options).toContain(cardD); // Can target Shieldbearer
        expect(playerA.controller.current?.options.length).toBe(1);
        playerA.controller.set(cardD); // Target Shieldbearer
        await promise;
        
        // After second attack
        expect(cardC.child.action.state.origin).toBe(2);
        expect(cardC.child.action.state.current).toBe(0); // No attacks remaining
        expect(cardD.child.health.state.current).toBe(2); // Shieldbearer: 3 - 1 = 2
        
        // Cannot attack anymore
        expect(cardC.child.action.status).toBe(false);
    });
}) 