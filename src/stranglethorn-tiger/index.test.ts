/**
 * Test cases for Stranglethorn Tiger
 * 
 * Initial state: Player A has Stranglethorn Tiger in hand.
 * Player B has a Wisp on board.
 * 
 * 1. stranglethorn-tiger-play: Player A plays Stranglethorn Tiger.
 * 2. wisp-attack: Player B's Wisp attacks, can only target Player A's hero (Stranglethorn Tiger has Stealth).
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { StranglethornTigerModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('stranglethorn-tiger', () => {
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
                            minions: [new StranglethornTigerModel()],
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
    const cardC = handA.refer.queue.find(item => item instanceof StranglethornTigerModel);
    const cardD = boardB.refer.queue.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('stranglethorn-tiger-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(5); // Stranglethorn Tiger: 5/5
        expect(roleC.child.health.state.current).toBe(5);
        expect(handA.refer.queue.length).toBe(1); // Stranglethorn Tiger in hand
        expect(boardA.refer.queue.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Stranglethorn Tiger
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Stranglethorn Tiger should be on board
        expect(boardA.refer.queue.length).toBe(1); // Stranglethorn Tiger on board
        expect(handA.refer.queue.length).toBe(0); // Stranglethorn Tiger moved to board
        expect(playerA.child.mana.state.current).toBe(5); // 10 - 5 = 5

        // Check that Stranglethorn Tiger has Stealth
        expect(roleC.child.feats.child.stealth.state.isActive).toBe(true); // Has Stealth
    });

    test('wisp-attack', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(roleC.child.health.state.current).toBe(5); // Stranglethorn Tiger: 5/5
        expect(roleA.child.health.state.current).toBe(30); // Player A hero: 30 health
        expect(boardA.refer.queue.length).toBe(1); // Stranglethorn Tiger on board
        expect(boardB.refer.queue.length).toBe(1); // Wisp on board

        // Player B's Wisp attacks, can only target Player A's hero (Stranglethorn Tiger has Stealth)
        let promise = roleD.child.action.run();
        expect(SelectUtil.current?.options).toContain(roleA); // Can target Player A's hero
        expect(SelectUtil.current?.options).not.toContain(roleC); // Cannot target Stranglethorn Tiger (Stealth)
        expect(SelectUtil.current?.options).not.toContain(roleB); // Cannot target Player B's hero
        SelectUtil.set(roleA); // Target Player A's hero
        await promise;

        // Player A's hero should take 1 damage
        expect(roleA.child.health.state.current).toBe(29); // Player A hero: 30 - 1 = 29
        expect(roleD.child.health.state.current).toBe(1); // Wisp: 1/1 (no damage)
    });
});
