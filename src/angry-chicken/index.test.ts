/*
 * Test scenarios for Angry Chicken:
 * 1. angry-chicken-attack: Player A's chicken attacks Player B's chicken, both die and A's chicken gains +5 attack from enrage
 */

import { GameModel, BoardModel, PlayerModel, MageModel, AnimeUtil, ManaModel, HandModel, DeckModel } from "hearthstone-core";
import { AngryChickenModel } from ".";
import { PowerWordShieldModel } from "../power-word-shield";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('angry-chicken', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [new AngryChickenModel()] }
                    }),
                    hand: new HandModel({
                        child: { 
                            minions: [],
                            spells: [new PowerWordShieldModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { 
                            minions: [new WispModel()]
                        }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [new AngryChickenModel()] }
                    })
                }
            })
        }
    });
    const root = boot(game);
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const cardC = boardA.child.minions.find((item: any) => item instanceof AngryChickenModel);
    const cardD = boardB.child.minions.find((item: any) => item instanceof AngryChickenModel);
    const cardE = handA.child.spells.find((item: any) => item instanceof PowerWordShieldModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    if (!roleC || !roleD || !cardE) throw new Error();

    test('power-word-shield-cast', async () => {
        // Cast Power Word: Shield on Angry Chicken to give it +2 Health
        let promise = cardE.play();
        expect(game.child.playerA.child.controller.current?.options).toContain(roleC);
        game.child.playerA.child.controller.set(roleC);
        await promise;

        // Check that Power Word: Shield was applied
        expect(roleC.child.health.state.current).toBe(3); // 1 + 2 = 3
        expect(roleC.child.attack.state.current).toBe(1); // Attack unchanged
        expect(handA.child.minions.length).toBe(1); // Drew a Wisp
    })

    test('angry-chicken-attack', async () => {
        // Check state after power-word-shield-cast (Angry Chicken has +2 Health buff)
        expect(roleC.child.attack.state.current).toBe(1);
        expect(roleC.child.health.state.current).toBe(3); // 1 + 2 = 3 (after Power Word: Shield)
        expect(roleD.child.attack.state.current).toBe(1);
        expect(roleD.child.health.state.current).toBe(1);

        const promise = roleC.child.action.run();
        await AnimeUtil.sleep();
        expect(game.child.playerA.child.controller.current).toBeDefined();
        expect(game.child.playerA.child.controller.current?.options).toContain(roleD);
        game.child.playerA.child.controller.set(roleD);
        await promise;
        // After attack: A's chicken (3 health) vs B's chicken (1 health)
        // Both take 1 damage: A's chicken becomes 2 health, B's chicken becomes 0 health
        expect(roleC.child.health.state.current).toBe(2); // 3 - 1 = 2 (damaged but alive)
        expect(roleC.child.attack.state.current).toBe(6); // 1 + 5 = 6 (enrage +5 attack triggered)
        expect(roleD.child.health.state.current).toBe(0); // 1 - 1 = 0 (dead)
        expect(roleD.child.attack.state.current).toBe(1); // die
        expect(cardC.child.dispose.status).toBe(false); // A's chicken survived due to shield
        expect(cardD.child.dispose.status).toBe(true); // B's chicken died
    })
})
