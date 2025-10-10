/**
 * Test cases for River Crocolisk
 * 
 * Initial state: Player A has River Crocolisk in hand.
 * Player B has empty board.
 * 
 * 1. river-crocolisk-play: Player A plays River Crocolisk.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { RiverCrocoliskModel } from "./index";
import { boot } from "../boot";

describe('river-crocolisk', () => {
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
                            minions: [new RiverCrocoliskModel()],
                            spells: []
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
    const cardC = handA.refer.queue?.find(item => item instanceof RiverCrocoliskModel);
    if (!cardC) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;

    test('river-crocolisk-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(2); // River Crocolisk: 2/3
        expect(roleC.child.health.state.current).toBe(3);
        expect(handA.refer.queue?.length).toBe(1); // River Crocolisk in hand
        expect(boardA.refer.queue?.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play River Crocolisk
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // River Crocolisk should be on board
        expect(boardA.refer.queue?.length).toBe(1); // River Crocolisk on board
        expect(handA.refer.queue?.length).toBe(0); // River Crocolisk moved to board
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 = 8
    });
});
