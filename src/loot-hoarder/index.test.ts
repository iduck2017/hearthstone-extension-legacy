/**
 * Test cases for Loot Hoarder
 * 
 * Initial state: Player A has Loot Hoarder in hand.
 * Player B has a Stranglethorn Tiger on board.
 * 
 * 1. loot-hoarder-play: Player A plays Loot Hoarder.
 * 2. loot-hoarder-death: Player B's Stranglethorn Tiger attacks Loot Hoarder, triggering deathrattle.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { LootHoarderModel } from "./index";
import { StranglethornTigerModel } from "../stranglethorn-tiger";
import { boot } from "../boot";
import { WispModel } from "../wisp";

describe('loot-hoarder', () => {
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
                            cards: [new LootHoarderModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { cards: [new WispModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new StranglethornTigerModel()]
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
    const deckA = playerA.child.deck;
    const cardC = handA.child.cards.find(item => item instanceof LootHoarderModel);
    const cardD = boardB.child.cards.find(item => item instanceof StranglethornTigerModel);
    const cardE = deckA.child.cards.find(item => item instanceof WispModel);
    const heroA = playerA.child.hero;
    if (!cardC || !cardD) throw new Error();

    test('loot-hoarder-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(2); // Loot Hoarder: 2/1
        expect(cardC.child.health.state.current).toBe(1);
        expect(handA.child.cards.length).toBe(1); // Loot Hoarder in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Loot Hoarder
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Loot Hoarder should be on board
        expect(boardA.child.cards.length).toBe(1); // Loot Hoarder on board
        expect(handA.child.cards.length).toBe(0); // Loot Hoarder moved to board
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 = 8
    });

    test('loot-hoarder-death', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Get Loot Hoarder from board
        const lootHoarderOnBoard = boardA.child.cards.find(item => item instanceof LootHoarderModel);
        if (!lootHoarderOnBoard) throw new Error();

        // Check initial state
        expect(lootHoarderOnBoard.child.health.state.current).toBe(1); // Loot Hoarder: 2/1
        expect(cardD.child.health.state.current).toBe(5); // Stranglethorn Tiger: 5/5
        expect(boardA.child.cards.length).toBe(1); // Loot Hoarder on board
        expect(boardB.child.cards.length).toBe(1); // Stranglethorn Tiger on board
        expect(handA.child.cards.length).toBe(0); // No cards in hand initially

        // Player B's Stranglethorn Tiger attacks Loot Hoarder
        let promise = cardD.child.action.run();
        expect(playerB.child.controller.current?.options).toContain(lootHoarderOnBoard); // Can target Loot Hoarder
        expect(playerB.child.controller.current?.options).toContain(heroA); // Can target Player A's hero
        playerB.child.controller.set(lootHoarderOnBoard); // Target Loot Hoarder
        await promise;

        expect(lootHoarderOnBoard.child.health.state.current).toBe(-4);
        expect(lootHoarderOnBoard.child.health.state.damage).toBe(5);

        expect(cardD.child.health.state.current).toBe(3);
        expect(cardD.child.health.state.damage).toBe(2);

        // Loot Hoarder should die (2/1 vs 5/5)
        expect(boardA.child.cards.length).toBe(0); // Loot Hoarder dies
        expect(lootHoarderOnBoard.child.dispose.status).toBe(true);
        
        // Deathrattle should draw a card
        expect(handA.child.cards.length).toBe(1); // Drew a card from deathrattle
        expect(handA.child.cards[0]).toBe(cardE);
    });
});
