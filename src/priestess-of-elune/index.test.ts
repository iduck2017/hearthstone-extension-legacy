/**
 * Test cases for Priestess of Elune
 * 
 * Initial state: Player A has Priestess of Elune and Fireball in hand.
 * 
 * 1. fireball-cast: Player A uses Fireball on self to damage hero.
 * 2. priestess-play: Player A plays Priestess of Elune, restoring 4 Health to hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { PriestessOfEluneModel } from "./index";
import { FireballModel } from "../fireball";
import { boot } from "../boot";

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
                            minions: []
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            minions: [new PriestessOfEluneModel()],
                            spells: [new FireballModel()]
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
                            minions: []
                        }
                    }),
                    hand: new HandModel({
                        child: { spells: [] }
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
    const cardC = handA.child.minions.find(item => item instanceof PriestessOfEluneModel);
    const cardD = handA.child.spells.find(item => item instanceof FireballModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;

    test('fireball-cast', async () => {
        // Check initial state
        expect(roleA.child.health.state.current).toBe(30); // Full health
        expect(handA.child.spells.length).toBe(1); // Fireball in hand
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Cast Fireball targeting Player A's hero
        const promise = cardD.play();
        expect(SelectUtil.current?.options).toContain(roleA); // Can target friendly hero
        expect(SelectUtil.current?.options).toContain(roleB); // Can target enemy hero
        SelectUtil.set(roleA); // Target Player A's hero
        await promise;

        // Hero should be damaged by 6
        expect(roleA.child.health.state.current).toBe(24); // 30 - 6 = 24

        // Fireball should be consumed
        expect(handA.child.spells.length).toBe(0); // Fireball consumed
        expect(playerA.child.mana.state.current).toBe(6);
    });

    test('priestess-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(5); // Priestess of Elune: 5/4
        expect(roleC.child.health.state.current).toBe(4);
        expect(roleA.child.health.state.current).toBe(24); // Damaged hero from fireball
        expect(handA.child.minions.length).toBe(1); // Priestess of Elune in hand
        expect(playerA.child.mana.state.current).toBe(6);

        // Play Priestess of Elune
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Hero should be healed by 4 Health
        expect(roleA.child.health.state.current).toBe(28); // 24 + 4 = 28

        // Priestess of Elune should be on board
        expect(boardA.child.minions.length).toBe(1); // Priestess of Elune on board
        expect(handA.child.minions.length).toBe(0); // Priestess of Elune moved to board
        expect(playerA.child.mana.state.current).toBe(0); 
    });
});
