/**
 * Test cases for Ogre Magi
 * 
 * Initial state: Player A has Ogre Magi on board.
 * Player B has empty board.
 * 
 * 1. ogre-magi-play: Player A plays Ogre Magi.
 * 2. fireball-cast: Player A casts Fireball with Ogre Magi on board, dealing 6+1=7 damage to Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { OgreMagiModel } from "./index";
import { FireballModel } from "../fireball";
import { boot } from "../boot";

describe('ogre-magi', () => {
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
                            minions: [new OgreMagiModel()],
                            spells: [new FireballModel()]
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
                            spells: []
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
    const cardC = handA.refer.order.find(item => item instanceof OgreMagiModel);
    const cardD = handA.refer.order.find(item => item instanceof FireballModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;

    test('ogre-magi-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(4); // Ogre Magi: 4/4
        expect(roleC.child.health.state.current).toBe(4);
        expect(handA.refer.order.length).toBe(2); // Ogre Magi and Fireball in hand
        expect(boardA.refer.order.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Ogre Magi
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Ogre Magi should be on board
        expect(boardA.refer.order.length).toBe(1); // Ogre Magi on board
        expect(handA.refer.order.length).toBe(1); // Fireball still in hand
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6
    });

    test('fireball-cast', async () => {
        // Check initial state
        expect(roleB.child.health.state.current).toBe(30); // Player B hero: 30 health
        expect(handA.refer.order.filter(item => item instanceof FireballModel).length).toBe(1);
        expect(playerA.child.mana.state.current).toBe(6);

        // Player A casts Fireball with Ogre Magi on board
        const promise = cardD.play();
        expect(SelectUtil.current?.options).toContain(roleA); // Can target friendly hero
        expect(SelectUtil.current?.options).toContain(roleB); // Can target enemy hero
        SelectUtil.set(roleB); // Target Player B's hero
        await promise;

        // Fireball should deal 6+1=7 damage (6 base + 1 from Ogre Magi)
        expect(roleB.child.health.state.current).toBe(23); // 30 - 7 = 23
        expect(playerA.child.mana.state.current).toBe(2); // 6 - 4 cost (Fireball costs 4)
        expect(handA.refer.order.filter(item => item instanceof FireballModel).length).toBe(0);
    });
});
