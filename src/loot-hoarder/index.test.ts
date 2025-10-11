/**
 * Test cases for Loot Hoarder
 * 
 * Initial state: Player A has Loot Hoarder in hand.
 * Player B has a Stranglethorn Tiger on board.
 * 
 * 1. loot-hoarder-play: Player A plays Loot Hoarder.
 * 2. loot-hoarder-death: Player B's Stranglethorn Tiger attacks Loot Hoarder, triggering deathrattle.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
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
                            minions: []
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            minions: [new LootHoarderModel()],
                            spells: []
                        }
                    }),
                    deck: new DeckModel({
                        child: { minions: [new WispModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            minions: [new StranglethornTigerModel()]
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
    const deckA = playerA.child.deck;
    const cardC = handA.refer.queue?.find(item => item instanceof LootHoarderModel);
    const cardD = boardB.refer.queue?.find(item => item instanceof StranglethornTigerModel);
    const cardE = deckA.refer.queue?.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('loot-hoarder-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(2); // Loot Hoarder: 2/1
        expect(roleC.child.health.state.current).toBe(1);
        expect(handA.refer.queue?.length).toBe(1); // Loot Hoarder in hand
        expect(boardA.refer.queue?.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Loot Hoarder
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Loot Hoarder should be on board
        expect(boardA.refer.queue?.length).toBe(1); // Loot Hoarder on board
        expect(handA.refer.queue?.length).toBe(0); // Loot Hoarder moved to board
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 = 8
    });

    test('loot-hoarder-death', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(roleC.child.health.state.current).toBe(1); // Loot Hoarder: 2/1
        expect(roleD.child.health.state.current).toBe(5); // Stranglethorn Tiger: 5/5
        expect(boardA.refer.queue?.length).toBe(1); // Loot Hoarder on board
        expect(boardB.refer.queue?.length).toBe(1); // Stranglethorn Tiger on board
        expect(handA.refer.queue?.length).toBe(0); // No cards in hand initially

        // Player B's Stranglethorn Tiger attacks Loot Hoarder
        let promise = roleD.child.action.run();
        expect(SelectUtil.current?.options).toContain(roleC); // Can target Loot Hoarder
        expect(SelectUtil.current?.options).toContain(roleA); // Cannot target Player A's hero (Stealth)
        SelectUtil.set(roleC); // Target Loot Hoarder
        await promise;

        expect(roleC.child.health.state.current).toBe(-4);
        expect(roleC.child.health.state.damage).toBe(5);

        expect(roleD.child.health.state.current).toBe(3);
        expect(roleD.child.health.state.damage).toBe(2);

        // Loot Hoarder should die (2/1 vs 5/5)
        expect(boardA.refer.queue?.length).toBe(0); // Loot Hoarder dies
        expect(cardC.child.dispose.status).toBe(true);
        
        // Deathrattle should draw a card
        expect(handA.refer.queue?.length).toBe(1); // Drew a card from deathrattle
        expect(handA.refer.queue?.[0]).toBe(cardE);
    });
});
