/**
 * Test cases for Priestess of Elune
 * 
 * Initial state: Player A has Priestess of Elune and Fireball in hand.
 * 
 * 1. fireball-cast: Player A uses Fireball on self to damage hero.
 * 2. priestess-play: Player A plays Priestess of Elune, restoring 4 Health to hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { PriestessOfEluneModel } from "./index";
import { FireballModel } from "../../mage/fireball";
import { boot } from "../../boot";

describe('priestess-of-elune', () => {
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
                            cards: [new PriestessOfEluneModel(), new FireballModel()]
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
                        child: { cards: [] }
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
    const cardC = handA.child.cards.find(item => item instanceof PriestessOfEluneModel);
    const cardD = handA.child.cards.find(item => item instanceof FireballModel);
    if (!cardC || !cardD) throw new Error();
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;

    test('fireball-cast', async () => {
        // Check initial state
        expect(heroA.child.health.state.current).toBe(30); // Full health
        expect(handA.child.cards.length).toBe(2); // Fireball and Priestess of Elune in hand
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Cast Fireball targeting Player A's hero
        const promise = cardD.play();
        expect(playerA.controller.current?.options).toContain(heroA); // Can target friendly hero
        expect(playerA.controller.current?.options).toContain(heroB); // Can target enemy hero
        playerA.controller.set(heroA); // Target Player A's hero
        await promise;

        // Hero should be damaged by 6
        expect(heroA.child.health.state.current).toBe(24); // 30 - 6 = 24

        // Fireball should be consumed
        expect(handA.child.cards.length).toBe(1); // Fireball consumed, Priestess of Elune remains
        expect(playerA.child.mana.state.current).toBe(6);
    });

    test('priestess-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(5); // Priestess of Elune: 5/4
        expect(cardC.child.health.state.current).toBe(4);
        expect(heroA.child.health.state.current).toBe(24); // Damaged hero from fireball
        expect(handA.child.cards.length).toBe(1); // Priestess of Elune in hand
        expect(playerA.child.mana.state.current).toBe(6);

        // Play Priestess of Elune
        let promise = cardC.play();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Hero should be healed by 4 Health
        expect(heroA.child.health.state.current).toBe(28); // 24 + 4 = 28

        // Priestess of Elune should be on board
        expect(boardA.child.cards.length).toBe(1); // Priestess of Elune on board
        expect(handA.child.cards.length).toBe(0); // Priestess of Elune moved to board
        expect(playerA.child.mana.state.current).toBe(0); 
    });
});
