/**
 * Test cases for Wolfrider
 * 
 * Initial state: Player A has Wolfrider in hand.
 * Player B has a Wisp on board.
 * 
 * 1. wolfrider-play: Player A plays Wolfrider.
 * 2. wolfrider-attack: Player A's Wolfrider attacks Player B's Wisp immediately (Charge).
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { WolfriderModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('wolfrider', () => {
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
                            cards: [new WolfriderModel()]
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
    const cardC = handA.child.cards.find(item => item instanceof WolfriderModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('wolfrider-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(3); // Wolfrider: 3/1
        expect(roleC.child.health.state.current).toBe(1);
        expect(handA.child.cards.length).toBe(1); // Wolfrider in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Wolfrider
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Wolfrider should be on board
        expect(boardA.child.cards.length).toBe(1); // Wolfrider on board
        expect(handA.child.cards.length).toBe(0); // Wolfrider moved to board
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 = 7

        // Check that Wolfrider has Charge
        expect(cardC.child.role.child.feats.child.charge.state.isActive).toBe(true); // Has Charge
    });

    test('wolfrider-attack', async () => {
        // Check initial state
        expect(roleC.child.health.state.current).toBe(1); // Wolfrider: 3/1
        expect(roleD.child.health.state.current).toBe(1); // Wisp: 1/1
        expect(boardA.child.cards.length).toBe(1); // Wolfrider on board
        expect(boardB.child.cards.length).toBe(1); // Wisp on board

        // Player A's Wolfrider attacks Player B's Wisp immediately (Charge allows immediate attack)
        let promise = roleC.child.action.run();
        expect(playerA.child.controller.current?.options).toContain(roleD); // Can target Wisp
        expect(playerA.child.controller.current?.options).toContain(roleB); // Can target Player B's hero
        playerA.child.controller.set(roleD); // Target Wisp
        await promise;

        // Wisp should die (1/1 vs 3/1)
        expect(boardB.child.cards.length).toBe(0); // Wisp dies
        expect(roleC.child.health.state.current).toBe(0); // Wolfrider: 1 - 1 = 0 (dies)

        expect(cardD.child.dispose.status).toBe(true);
        expect(roleD.child.health.state.damage).toBe(3);
        expect(roleD.child.health.state.current).toBe(-2);

        expect(boardA.child.cards.length).toBe(0); // Wolfrider dies
    });
});
