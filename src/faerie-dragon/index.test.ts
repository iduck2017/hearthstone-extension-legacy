/**
 * Test cases for Faerie Dragon
 * 
 * Initial state: Player A has Faerie Dragon in hand.
 * Player B has empty board.
 * 
 * 1. faerie-dragon-play: Player A plays Faerie Dragon.
 * 2. faerie-dragon-attack: Player A's Faerie Dragon attacks Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { FaerieDragonModel } from "./index";
import { FireballModel } from "../fireball";
import { boot } from "../boot";

describe('faerie-dragon', () => {
    const game = new GameModel(() => ({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { 
                            minions: []
                        }
                    })),
                    hand: new HandModel(() => ({
                        child: { 
                            minions: [new FaerieDragonModel()],
                            spells: []
                        }
                    })),
                    deck: new DeckModel(() => ({
                        child: { minions: [] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { 
                            minions: []
                        }
                    })),
                    hand: new HandModel(() => ({
                        child: { 
                            minions: [],
                            spells: [new FireballModel()]
                        }
                    }))
                }
            }))
        }
    }));
    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const handA = playerA.child.hand;
    const handB = playerB.child.hand;
    const cardC = handA.refer.order.find(item => item instanceof FaerieDragonModel);
    const cardD = handB.refer.order.find(item => item instanceof FireballModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;

    test('faerie-dragon-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(3); // Faerie Dragon: 3/2
        expect(roleC.child.health.state.current).toBe(2);
        expect(handA.refer.order.length).toBe(1); // Faerie Dragon in hand
        expect(boardA.refer.order.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana
        // Play Faerie Dragon
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Faerie Dragon should be on board
        expect(boardA.refer.order.length).toBe(1); // Faerie Dragon on board
        expect(handA.refer.order.length).toBe(0); // Faerie Dragon moved to board
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 = 8

        // Check that Faerie Dragon has Elusive
        expect(roleC.child.feats.child.elusive.state.isActive).toBe(true); // Has Elusive
    });

    test('fireball-cast', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(roleA.child.health.state.current).toBe(30); // Player A hero: 30 health
        expect(roleC.child.health.state.current).toBe(2); // Faerie Dragon: 3/2
        expect(handB.refer.order.length).toBe(1); // Fireball in hand
        expect(boardA.refer.order.length).toBe(1); // Faerie Dragon on board

        // Player B casts Fireball
        let promise = cardD.play();
        // Choose target for Fireball (cannot target Faerie Dragon due to Elusive)
        expect(SelectUtil.current?.options).toContain(roleA); // Can target Player A's hero
        expect(SelectUtil.current?.options).toContain(roleB); // Can target Player B's hero
        expect(SelectUtil.current?.options).not.toContain(roleC); // Cannot target Faerie Dragon (Elusive)
        SelectUtil.set(roleA); // Target Player A's hero
        await promise;

        // Player A's hero should take 6 damage
        expect(roleA.child.health.state.current).toBe(24); // Player A hero: 30 - 6 = 24
        expect(roleC.child.health.state.current).toBe(2); // Faerie Dragon: 3/2 (no damage, Elusive protected it)
    });
});
