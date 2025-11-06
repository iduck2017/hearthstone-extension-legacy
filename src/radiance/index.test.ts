/**
 * Test cases for Radiance
 * 
 * Initial state: Player A has Fireball in hand.
 * Player B has Radiance in hand.
 * Player A's hero has 25 Health (damaged).
 * 
 * 1. fireball-cast: Player A uses Fireball on Player B's hero, dealing 6 damage.
 * 2. radiance-cast: Player B uses Radiance, restores 5 Health to hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { RadianceModel } from "./index";
import { FireballModel } from "../fireball";
import { boot } from "../boot";

describe('radiance', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [] }
                    }),
                    hand: new HandModel({
                        child: { 
                            minions: [],
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
                        child: { minions: [] }
                    }),
                    hand: new HandModel({
                        child: { 
                            minions: [],
                            spells: [new RadianceModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { minions: [] }
                    })
                }
            })
        }
    });
    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;
    const handA = playerA.child.hand;
    const handB = playerB.child.hand;
    const cardC = handA.child.spells.find(item => item instanceof FireballModel);
    const cardD = handB.child.spells.find(item => item instanceof RadianceModel);
    const roleB = heroB.child.role;
    if (!cardC || !cardD) throw new Error();

    test('fireball-cast', async () => {
        // Check initial state
        expect(heroB.child.role.child.health.state.current).toBe(30); // Full health
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.refer.queue.length).toBe(1);

        // Player A uses Fireball on Player B's hero
        const promise = cardC.play();
        expect(playerA.child.controller.current?.options).toContain(heroB.child.role);
        playerA.child.controller.set(heroB.child.role);
        await promise;

        // Player B's hero should take 6 damage
        expect(heroB.child.role.child.health.state.current).toBe(24); // 30 - 6 = 24

        // Fireball should be consumed
        expect(handA.refer.queue.length).toBe(0); // Fireball consumed
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 cost
    });

    test('radiance-cast', async () => {
        game.child.turn.next()

        // Check initial state
        expect(roleB.child.health.state.current).toBe(24); // Damaged hero
        expect(playerB.child.mana.state.current).toBe(10);
        expect(handB.refer.queue.length).toBe(1);

        // Player B uses Radiance
        const promise = cardD.play();
        await promise;

        // Hero should be healed by 5 Health
        expect(roleB.child.health.state.current).toBe(29); // 24 + 5 = 29

        // Radiance should be consumed
        expect(handB.refer.queue.length).toBe(0); // Radiance consumed
        expect(playerB.child.mana.state.current).toBe(9); // 10 - 1 cost
    });
});
