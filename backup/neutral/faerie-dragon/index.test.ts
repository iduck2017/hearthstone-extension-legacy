/**
 * Test cases for Faerie Dragon
 * 
 * Initial state: Player A has Faerie Dragon in hand.
 * Player B has empty board.
 * 
 * 1. faerie-dragon-play: Player A plays Faerie Dragon.
 * 2. faerie-dragon-attack: Player A's Faerie Dragon attacks Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { FaerieDragonModel } from "./index";
import { FireballModel } from "../../mage/fireball";
import { boot } from "../../boot";

describe('faerie-dragon', () => {
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
                            cards: [new FaerieDragonModel()]
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
                            cards: [new FireballModel()]
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
    const handB = playerB.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof FaerieDragonModel);
    const cardD = handB.child.cards.find(item => item instanceof FireballModel);
    if (!cardC || !cardD) throw new Error();
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;

    test('faerie-dragon-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(3); // Faerie Dragon: 3/2
        expect(cardC.child.health.state.current).toBe(2);
        expect(handA.child.cards.length).toBe(1); // Faerie Dragon in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana
        // Play Faerie Dragon
        let promise = cardC.play();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Faerie Dragon should be on board
        expect(boardA.child.cards.length).toBe(1); // Faerie Dragon on board
        expect(handA.child.cards.length).toBe(0); // Faerie Dragon moved to board
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 = 8

        // Check that Faerie Dragon has Elusive
        expect(cardC.child.feats.child.elusive.state.isActive).toBe(true); // Has Elusive
    });

    test('fireball-cast', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(heroA.child.health.state.current).toBe(30); // Player A hero: 30 health
        expect(cardC.child.health.state.current).toBe(2); // Faerie Dragon: 3/2
        expect(handB.child.cards.length).toBe(1); // Fireball in hand
        expect(boardA.child.cards.length).toBe(1); // Faerie Dragon on board

        // Player B casts Fireball
        let promise = cardD.play();
        // Choose target for Fireball (cannot target Faerie Dragon due to Elusive)
        expect(playerB.controller.current?.options).toContain(heroA); // Can target Player A's hero
        expect(playerB.controller.current?.options).toContain(heroB); // Can target Player B's hero
        expect(playerB.controller.current?.options).not.toContain(cardC); // Cannot target Faerie Dragon (Elusive)
        playerB.controller.set(heroA); // Target Player A's hero
        await promise;

        // Player A's hero should take 6 damage
        expect(heroA.child.health.state.current).toBe(24); // Player A hero: 30 - 6 = 24
        expect(cardC.child.health.state.current).toBe(2); // Faerie Dragon: 3/2 (no damage, Elusive protected it)
    });
});
