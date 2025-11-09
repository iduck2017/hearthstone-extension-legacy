/**
 * Test cases for Kobold Geomancer
 * 
 * Initial state: Player A has Kobold Geomancer in hand.
 * Player B has empty board.
 * 
 * 1. kobold-geomancer-play: Player A plays Kobold Geomancer.
 * 2. fireball-cast: Player A casts Fireball with Spell Damage +1.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { KoboldGeomancerModel } from "./index";
import { FireballModel } from "../fireball";
import { boot } from "../boot";

describe('kobold-geomancer', () => {
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
                            cards: [new KoboldGeomancerModel(), new FireballModel()]
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
                            cards: []
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
    const handA = playerA.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof KoboldGeomancerModel);
    const cardD = handA.child.cards.find(item => item instanceof FireballModel);
    if (!cardC || !cardD) throw new Error();
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;

    test('kobold-geomancer-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(2); // Kobold Geomancer: 2/2
        expect(cardC.child.health.state.current).toBe(2);
        expect(handA.child.cards.length).toBe(2); // Kobold Geomancer + Fireball in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Kobold Geomancer
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Kobold Geomancer should be on board
        expect(boardA.child.cards.length).toBe(1); // Kobold Geomancer on board
        expect(handA.child.cards.length).toBe(1); // Fireball remaining in hand
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 = 8
    });

    test('fireball-cast', async () => {
        // Check initial state
        expect(heroB.child.health.state.current).toBe(30); // Player B hero: 30 health
        expect(handA.child.cards.length).toBe(1); // Fireball in hand
        expect(boardA.child.cards.length).toBe(1); // Kobold Geomancer on board

        // Player A casts Fireball
        let promise = cardD.play();
        // Choose target for Fireball (Player B's hero)
        expect(playerA.child.controller.current?.options).toContain(heroB); // Can target Player B's hero
        expect(playerA.child.controller.current?.options).toContain(heroA); // Can target Player A's hero
        playerA.child.controller.set(heroB); // Target Player B's hero
        await promise;

        // Player B's hero should take 7 damage (6 + 1 from Spell Damage +1)
        expect(heroB.child.health.state.current).toBe(23); // Player B hero: 30 - 7 = 23
    });
});
