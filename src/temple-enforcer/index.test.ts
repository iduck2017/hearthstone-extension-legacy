/**
 * Test cases for Temple Enforcer
 * 
 * Initial state: Player A has Temple Enforcer in hand.
 * Player A has a friendly minion on board.
 * 
 * 1. temple-enforcer-play: Player A plays Temple Enforcer, giving a friendly minion +3 Health.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, AnimeUtil } from "hearthstone-core";
import { TempleEnforcerModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('temple-enforcer', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
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
                            minions: [new TempleEnforcerModel()],
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
                        child: { spells: [] }
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
    const cardC = handA.child.minions.find(item => item instanceof TempleEnforcerModel);
    const cardD = boardA.child.minions.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('temple-enforcer-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(5); // Temple Enforcer: 5/6
        expect(roleC.child.health.state.current).toBe(6);
        expect(roleD.child.attack.state.current).toBe(1); // Wisp: 1/1
        expect(roleD.child.health.state.current).toBe(1);
        expect(handA.child.minions.length).toBe(1); // Temple Enforcer in hand
        expect(boardA.child.minions.length).toBe(1); // Only Wisp on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Temple Enforcer
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await AnimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleD);
        SelectUtil.set(roleD);
        await promise;

        // Wisp should have +3 Health buff
        expect(roleD.child.attack.state.current).toBe(1); // Attack unchanged
        expect(roleD.child.health.state.current).toBe(4); // 1 + 3 = 4

        // Temple Enforcer should be on board
        expect(boardA.child.minions.length).toBe(2); // Temple Enforcer and Wisp on board
        expect(handA.child.minions.length).toBe(0); // Temple Enforcer moved to board
        expect(playerA.child.mana.state.current).toBe(5); // 10 - 5 = 5
    });
});
