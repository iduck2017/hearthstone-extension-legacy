/**
 * Test cases for Frostwolf Grunt
 * 
 * Initial state: Player A has Frostwolf Grunt in hand.
 * Player B has a Wisp on board.
 * 
 * 1. frostwolf-grunt-play: Player A plays Frostwolf Grunt.
 * 2. wisp-attack: Player B's Wisp attacks, can only target Frostwolf Grunt (Taunt forces this).
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
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
                            cards: []
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new FrostwolfGruntModel()]
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
    const cardC = handA.child.cards.find(item => item instanceof FrostwolfGruntModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const heroA = playerA.child.hero;

    test('frostwolf-grunt-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(2); // Frostwolf Grunt: 2/2
        expect(cardC.child.health.state.current).toBe(2);
        expect(handA.child.cards.length).toBe(1); // Frostwolf Grunt in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Frostwolf Grunt
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Frostwolf Grunt should be on board
        expect(boardA.child.cards.length).toBe(1); // Frostwolf Grunt on board
        expect(handA.child.cards.length).toBe(0); // Frostwolf Grunt moved to board
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 = 8

        // Check that Frostwolf Grunt has Taunt
        expect(cardC.child.feats.child.taunt).toBeDefined(); // Has Taunt
    });

    test('wisp-attack', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(cardC.child.health.state.current).toBe(2); // Frostwolf Grunt: 2/2
        expect(cardD.child.health.state.current).toBe(1); // Wisp: 1/1
        expect(boardA.child.cards.length).toBe(1); // Frostwolf Grunt on board
        expect(boardB.child.cards.length).toBe(1); // Wisp on board

        // Player B's Wisp attacks, can only target Frostwolf Grunt (Taunt forces this)
        let promise = cardD.child.action.run();
        expect(playerB.child.controller.current?.options).toContain(cardC); // Can target Frostwolf Grunt (Taunt forces this)
        expect(playerB.child.controller.current?.options).not.toContain(heroA); // Cannot target Player A's hero (Taunt blocks)
        playerB.child.controller.set(cardC); // Target Frostwolf Grunt
        await promise;

        expect(cardC.child.health.state.current).toBe(1);
        expect(cardC.child.health.state.damage).toBe(1);
        expect(cardC.child.health.state.maximum).toBe(2);
        expect(cardC.child.dispose.status).toBe(false);

        expect(cardD.child.health.state.current).toBe(-1);
        expect(cardD.child.dispose.status).toBe(true);

        // Both minions should die (1/1 vs 2/2)
        expect(boardA.child.cards.length).toBe(1); 
        expect(boardB.child.cards.length).toBe(0); // Wisp dies
    });
});
