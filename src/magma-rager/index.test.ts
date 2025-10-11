/**
 * Test cases for Magma Rager
 * 
 * Initial state: Player A has Magma Rager in hand.
 * Player B has empty board.
 * 
 * 1. magma-rager-play: Player A plays Magma Rager.
 * 2. magma-rager-attack: Player A's Magma Rager attacks Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { MagmaRagerModel } from "./index";
import { boot } from "../boot";

describe('magma-rager', () => {
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
                            minions: [new MagmaRagerModel()],
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
    const cardC = handA.refer.queue?.find(item => item instanceof MagmaRagerModel);
    if (!cardC) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;

    test('magma-rager-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(5); // Magma Rager: 5/1
        expect(roleC.child.health.state.current).toBe(1);
        expect(handA.refer.queue?.length).toBe(1); // Magma Rager in hand
        expect(boardA.refer.queue?.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Magma Rager
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Magma Rager should be on board
        expect(boardA.refer.queue?.length).toBe(1); // Magma Rager on board
        expect(handA.refer.queue?.length).toBe(0); // Magma Rager moved to board
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 = 7
    });
});
