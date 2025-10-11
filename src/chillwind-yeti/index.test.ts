/**
 * Test cases for Chillwind Yeti
 * 
 * Initial state: Player A has Chillwind Yeti in hand.
 * Player B has empty board.
 * 
 * 1. chillwind-yeti-play: Player A plays Chillwind Yeti.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { ChillwindYetiModel } from "./index";
import { boot } from "../boot";

describe('chillwind-yeti', () => {
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
                            minions: [new ChillwindYetiModel()],
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
    const cardC = handA.refer.queue.find(item => item instanceof ChillwindYetiModel);
    if (!cardC) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;

    test('chillwind-yeti-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(4); // Chillwind Yeti: 4/5
        expect(roleC.child.health.state.current).toBe(5);
        expect(handA.refer.queue.length).toBe(1); // Chillwind Yeti in hand
        expect(boardA.refer.queue.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Chillwind Yeti
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Chillwind Yeti should be on board
        expect(boardA.refer.queue.length).toBe(1); // Chillwind Yeti on board
        expect(handA.refer.queue.length).toBe(0); // Chillwind Yeti moved to board
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6
    });
});
