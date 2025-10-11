/**
 * Test cases for War Golem
 * 
 * Initial state: Player A has War Golem in hand.
 * Player B has empty board.
 * 
 * 1. war-golem-play: Player A plays War Golem.
 * 2. war-golem-attack: Player A's War Golem attacks Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { WarGolemModel } from "./index";
import { boot } from "../boot";

describe('war-golem', () => {
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
                            minions: [new WarGolemModel()],
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
    const cardC = handA.refer.queue?.find(item => item instanceof WarGolemModel);
    if (!cardC) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;

    test('war-golem-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(7); // War Golem: 7/7
        expect(roleC.child.health.state.current).toBe(7);
        expect(handA.refer.queue?.length).toBe(1); // War Golem in hand
        expect(boardA.refer.queue?.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play War Golem
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // War Golem should be on board
        expect(boardA.refer.queue?.length).toBe(1); // War Golem on board
        expect(handA.refer.queue?.length).toBe(0); // War Golem moved to board
        expect(playerA.child.mana.state.current).toBe(3); // 10 - 7 = 3
    });

    test('war-golem-attack', async () => {
        game.child.turn.next();
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerA);

        // Check initial state
        expect(roleC.child.health.state.current).toBe(7); // War Golem: 7/7
        expect(roleB.child.health.state.current).toBe(30); // Player B hero: 30 health
        expect(boardA.refer.queue?.length).toBe(1); // War Golem on board

        // Player A's War Golem attacks Player B's hero
        let promise = roleC.child.action.run();
        expect(SelectUtil.current?.options).toContain(roleB); // Can target Player B's hero
        SelectUtil.set(roleB); // Target Player B's hero
        await promise;

        // Player B's hero should take 7 damage
        expect(roleB.child.health.state.current).toBe(23); // Player B hero: 30 - 7 = 23
        expect(roleC.child.health.state.current).toBe(7); // War Golem: 7/7 (no damage)
    });
});
