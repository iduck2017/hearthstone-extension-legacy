/**
 * Test cases for Oasis Snapjaw
 * 
 * Initial state: Player A has Oasis Snapjaw in hand.
 * 
 * 1. oasis-snapjaw-play: Player A plays Oasis Snapjaw.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { OasisSnapjawModel } from "./index";
import { boot } from "../boot";

describe('oasis-snapjaw', () => {
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
                            cards: [new OasisSnapjawModel()]
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
                            cards: [new OasisSnapjawModel()]
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
    const cardC = handA.child.cards.find(item => item instanceof OasisSnapjawModel);
    const cardD = boardB.child.cards.find(item => item instanceof OasisSnapjawModel);
    if (!cardC || !cardD) throw new Error();
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;
    const roleA = playerA.child.hero.child.role;

    test('oasis-snapjaw-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(2); // Oasis Snapjaw: 2/7
        expect(roleC.child.health.state.current).toBe(7);
        expect(handA.child.cards.length).toBe(1); // Oasis Snapjaw in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Oasis Snapjaw
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Oasis Snapjaw should be on board
        expect(boardA.child.cards.length).toBe(1); // Oasis Snapjaw on board
        expect(handA.child.cards.length).toBe(0); // Oasis Snapjaw moved to board
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6

        // Check that Oasis Snapjaw has no special abilities
        expect(cardC.child.feats.child.battlecry).toEqual([]); // No battlecry
    });

    test('oasis-snapjaw-attack', async () => {
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        expect(roleD.child.attack.state.current).toBe(2); // Oasis Snapjaw: 2/7
        expect(roleD.child.health.state.current).toBe(7);

        let promise = roleD.child.action.run();
        expect(playerB.child.controller.current?.options).toContain(roleC);
        expect(playerB.child.controller.current?.options).toContain(roleA);
        playerB.child.controller.set(roleC);
        await promise;

        expect(roleC.child.health.state.current).toBe(5); // Oasis Snapjaw: 2/7
        expect(roleC.child.health.state.damage).toBe(2);

        // Check initial state
        expect(roleC.child.attack.state.current).toBe(2); // Oasis Snapjaw: 2/7
        expect(roleC.child.health.state.current).toBe(5);
        expect(cardC.child.dispose.status).toBe(false);

        expect(roleD.child.attack.state.current).toBe(2);
        expect(roleD.child.health.state.current).toBe(5);
        expect(roleD.child.health.state.damage).toBe(2);
        expect(cardD.child.dispose.status).toBe(false);
        
        expect(boardA.child.cards.length).toBe(1); // Oasis Snapjaw on board
        expect(boardB.child.cards.length).toBe(1); // Oasis Snapjaw on board
    });
});
