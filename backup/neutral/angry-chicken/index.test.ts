/*
 * Test scenarios for Angry Chicken:
 * 1. angry-chicken-attack: Player A's chicken attacks Player B's chicken, both die and A's chicken gains +5 attack from enrage
 */

import { GameModel, BoardModel, PlayerModel, MageModel, AnimeUtil, ManaModel, HandModel, DeckModel } from "hearthstone-core";
import { AngryChickenModel } from ".";
import { PowerWordShieldModel } from "../../priest/power-word-shield";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";

describe('angry-chicken', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new AngryChickenModel()] }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new PowerWordShieldModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { 
                            cards: [new WispModel()]
                        }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new AngryChickenModel()] }
                    })
                }
            })
        }
    });
    const root = boot(game);
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const cardC = boardA.child.cards.find((item: any) => item instanceof AngryChickenModel);
    const cardD = boardB.child.cards.find((item: any) => item instanceof AngryChickenModel);
    const cardE = handA.child.cards.find((item: any) => item instanceof PowerWordShieldModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    test('power-word-shield-cast', async () => {
        // Cast Power Word: Shield on Angry Chicken to give it +2 Health
        let promise = cardE.play();
        expect(game.child.playerA.controller.current?.options).toContain(cardC);
        game.child.playerA.controller.set(cardC);
        await promise;

        // Check that Power Word: Shield was applied
        expect(cardC.child.health.state.current).toBe(3); // 1 + 2 = 3
        expect(cardC.child.attack.state.current).toBe(1); // Attack unchanged
        expect(handA.child.cards.length).toBe(1); // Drew a Wisp
    })

    test('angry-chicken-attack', async () => {
        // Check state after power-word-shield-cast (Angry Chicken has +2 Health buff)
        expect(cardC.child.attack.state.current).toBe(1);
        expect(cardC.child.health.state.current).toBe(3); // 1 + 2 = 3 (after Power Word: Shield)
        expect(cardD.child.attack.state.current).toBe(1);
        expect(cardD.child.health.state.current).toBe(1);

        const promise = cardC.child.action.run();
        await AnimeUtil.sleep();
        expect(game.child.playerA.controller.current).toBeDefined();
        expect(game.child.playerA.controller.current?.options).toContain(cardD);
        game.child.playerA.controller.set(cardD);
        await promise;
        // After attack: A's chicken (3 health) vs B's chicken (1 health)
        // Both take 1 damage: A's chicken becomes 2 health, B's chicken becomes 0 health
        expect(cardC.child.health.state.current).toBe(2); // 3 - 1 = 2 (damaged but alive)
        expect(cardC.child.attack.state.current).toBe(6); // 1 + 5 = 6 (enrage +5 attack triggered)
        expect(cardD.child.health.state.current).toBe(0); // 1 - 1 = 0 (dead)
        expect(cardD.child.attack.state.current).toBe(1); // die
        expect(cardC.child.dispose.status).toBe(false); // A's chicken survived due to shield
        expect(cardD.child.dispose.status).toBe(true); // B's chicken died
    })
})
