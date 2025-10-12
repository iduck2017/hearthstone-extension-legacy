/**
 * Test cases for Young Dragonhawk
 * 
 * Initial state: Player A has Young Dragonhawk on board.
 * Player B has Shieldbearer on board.
 * 
 * 1. young-dragonhawk-windfury: Player A's Young Dragonhawk attacks Player B's Shieldbearer twice.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, AnimeUtil } from "hearthstone-core";
import { YoungDragonhawkModel } from "./index";
import { ShieldbearerModel } from "../shieldbearer";
import { boot } from "../boot";

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
                            minions: [new YoungDragonhawkModel()]
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
                            minions: [new ShieldbearerModel()]
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
    const cardC = boardA.refer.queue.find(item => item instanceof YoungDragonhawkModel);
    const cardD = boardB.refer.queue.find(item => item instanceof ShieldbearerModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('young-dragonhawk-windfury', async () => {
        // Check initial state
        expect(boardA.refer.queue.length).toBe(1); // Young Dragonhawk on board
        expect(boardB.refer.queue.length).toBe(1); // Shieldbearer on board
        expect(roleC.child.action.state.origin).toBe(2); // Windfury: 2 attacks
        expect(roleC.child.action.state.current).toBe(2);
        expect(roleD.child.health.state.current).toBe(4); // Shieldbearer: 4 health
        
        // First attack
        let promise = roleC.child.action.run();
        await AnimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleD); // Can target Shieldbearer
        expect(SelectUtil.current?.options.length).toBe(1);
        SelectUtil.set(roleD); // Target Shieldbearer
        await promise;
        
        // After first attack
        expect(roleC.child.action.state.origin).toBe(2);
        expect(roleC.child.action.state.current).toBe(1); // 1 attack remaining
        expect(roleD.child.health.state.current).toBe(3); // Shieldbearer: 4 - 1 = 3
        
        // Second attack
        promise = roleC.child.action.run();
        await AnimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleD); // Can target Shieldbearer
        expect(SelectUtil.current?.options).not.toContain(roleB); // Cannot target Player B's hero
        expect(SelectUtil.current?.options.length).toBe(1);
        SelectUtil.set(roleD); // Target Shieldbearer
        await promise;
        
        // After second attack
        expect(roleC.child.action.state.origin).toBe(2);
        expect(roleC.child.action.state.current).toBe(0); // No attacks remaining
        expect(roleD.child.health.state.current).toBe(2); // Shieldbearer: 3 - 1 = 2
        
        // Cannot attack anymore
        expect(roleC.child.action.status).toBe(false);
    });
}) 