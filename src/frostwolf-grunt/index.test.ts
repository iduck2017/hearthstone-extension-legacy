/**
 * Test cases for Frostwolf Grunt
 * 
 * Initial state: Player A has Frostwolf Grunt in hand.
 * Player B has a Wisp on board.
 * 
 * 1. frostwolf-grunt-play: Player A plays Frostwolf Grunt.
 * 2. wisp-attack: Player B's Wisp attacks, can only target Frostwolf Grunt (Taunt forces this).
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { FrostwolfGruntModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('frostwolf-grunt', () => {
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
                            minions: [new FrostwolfGruntModel()],
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
                            minions: [new WispModel()]
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
    const handA = playerA.child.hand;
    const cardC = handA.refer.queue.find(item => item instanceof FrostwolfGruntModel);
    const cardD = boardB.refer.queue.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('frostwolf-grunt-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(2); // Frostwolf Grunt: 2/2
        expect(roleC.child.health.state.current).toBe(2);
        expect(handA.refer.queue.length).toBe(1); // Frostwolf Grunt in hand
        expect(boardA.refer.queue.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Frostwolf Grunt
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Frostwolf Grunt should be on board
        expect(boardA.refer.queue.length).toBe(1); // Frostwolf Grunt on board
        expect(handA.refer.queue.length).toBe(0); // Frostwolf Grunt moved to board
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 = 8

        // Check that Frostwolf Grunt has Taunt
        expect(roleC.child.feats.child.taunt).toBeDefined(); // Has Taunt
    });

    test('wisp-attack', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(roleC.child.health.state.current).toBe(2); // Frostwolf Grunt: 2/2
        expect(roleD.child.health.state.current).toBe(1); // Wisp: 1/1
        expect(boardA.refer.queue.length).toBe(1); // Frostwolf Grunt on board
        expect(boardB.refer.queue.length).toBe(1); // Wisp on board

        // Player B's Wisp attacks, can only target Frostwolf Grunt (Taunt forces this)
        let promise = roleD.child.action.run();
        expect(SelectUtil.current?.options).toContain(roleC); // Can target Frostwolf Grunt (Taunt forces this)
        expect(SelectUtil.current?.options).not.toContain(roleA); // Cannot target Player A's hero (Taunt blocks)
        expect(SelectUtil.current?.options).not.toContain(roleB); // Cannot target Player B's hero
        SelectUtil.set(roleC); // Target Frostwolf Grunt
        await promise;

        expect(roleC.child.health.state.current).toBe(1);
        expect(roleC.child.health.state.damage).toBe(1);
        expect(roleC.child.health.state.maximum).toBe(2);
        expect(cardC.child.dispose.status).toBe(false);

        expect(roleD.child.health.state.current).toBe(-1);
        expect(cardD.child.dispose.status).toBe(true);

        // Both minions should die (1/1 vs 2/2)
        expect(boardA.refer.queue.length).toBe(1); 
        expect(boardB.refer.queue.length).toBe(0); // Wisp dies
    });
});
