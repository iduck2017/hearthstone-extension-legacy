/**
 * Test cases for Ironfur Grizzly
 * 
 * Initial state: Player A has Ironfur Grizzly in hand.
 * Player B has a Wisp on board.
 * 
 * 1. ironfur-grizzly-play: Player A plays Ironfur Grizzly.
 * 2. taunt-test: Player B's Wisp must attack Ironfur Grizzly due to Taunt.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { IronfurGrizzlyModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('ironfur-grizzly', () => {
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
                            cards: [new IronfurGrizzlyModel()]
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
                            cards: [new WispModel()]
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
    const handA = playerA.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof IronfurGrizzlyModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('ironfur-grizzly-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(3); // Ironfur Grizzly: 3/3
        expect(roleC.child.health.state.current).toBe(3);
        expect(handA.child.cards.length).toBe(1); // Ironfur Grizzly in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Ironfur Grizzly
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Ironfur Grizzly should be on board
        expect(boardA.child.cards.length).toBe(1); // Ironfur Grizzly on board
        expect(handA.child.cards.length).toBe(0); // Ironfur Grizzly moved to board
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 = 7

        // Check that Ironfur Grizzly has Taunt
        expect(roleC.child.feats.child.taunt).toBeDefined(); // Has Taunt
    });

    test('taunt-test', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(roleC.child.health.state.current).toBe(3); // Ironfur Grizzly: 3/3
        expect(roleD.child.health.state.current).toBe(1); // Wisp: 1/1
        expect(boardA.child.cards.length).toBe(1); // Ironfur Grizzly on board
        expect(boardB.child.cards.length).toBe(1); // Wisp on board

        // Player B's Wisp attacks - should be forced to target Ironfur Grizzly due to Taunt
        let promise = roleD.child.action.run();
        expect(playerB.child.controller.current?.options).toContain(roleC); // Can target Ironfur Grizzly (Taunt)
        expect(playerB.child.controller.current?.options).not.toContain(roleA); // Cannot target Player A's hero (Taunt blocks)
        playerB.child.controller.set(roleC); // Target Ironfur Grizzly
        await promise;

        // Both minions should take damage
        expect(roleC.child.health.state.current).toBe(2); // Ironfur Grizzly: 3 - 1 = 2
        expect(roleD.child.health.state.current).toBe(-2); // Wisp: 1 - 3 = -2 (dies)
        expect(boardB.child.cards.length).toBe(0); // Wisp dies
    });
});
