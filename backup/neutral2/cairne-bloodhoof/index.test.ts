/**
 * Test cases for Cairne Bloodhoof
 * 
 * Initial state: Player A has Fireball in hand and Wisp on board.
 * Player B has Cairne Bloodhoof on board.
 * 
 * 1. fireball-cast: Player A uses Fireball to kill Cairne Bloodhoof, summoning Baine Bloodhoof.
 * 2. wisp-attack: Player A's Wisp cannot attack Player B's hero due to Baine Bloodhoof's Taunt.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { CairneBloodhoofModel } from "./index";
import { BaineBloodhoofModel } from "../baine-bloodhoof";
import { FireballModel } from "../../../backup/mage/fireball";
import { WispModel } from "../wisp";
import { boot } from "../../boot";

describe('cairne-bloodhoof', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
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
                            cards: [new FireballModel()]
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
                            cards: [new CairneBloodhoofModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
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
    const cardC = handA.child.cards.find(item => item instanceof FireballModel);
    const cardD = boardA.child.cards.find(item => item instanceof WispModel);
    const cardE = boardB.child.cards.find(item => item instanceof CairneBloodhoofModel);
    if (!cardC || !cardD || !cardE) throw new Error();
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;

    test('fireball-cast', async () => {
        // Check initial state
        expect(cardE.child.attack.state.current).toBe(5); // Cairne Bloodhoof: 5/5
        expect(cardE.child.health.state.current).toBe(5);
        expect(boardB.child.cards.length).toBe(1); // Only Cairne Bloodhoof on board
        expect(handA.child.cards.length).toBe(1); // Fireball in hand
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Cast Fireball targeting Cairne Bloodhoof
        const promise = cardC.play();
        expect(playerA.controller.current?.options).toContain(heroA); // Can target friendly hero
        expect(playerA.controller.current?.options).toContain(heroB); // Can target enemy hero
        expect(playerA.controller.current?.options).toContain(cardE); // Can target enemy minion
        playerA.controller.set(cardE); // Target Cairne Bloodhoof
        await promise;

        // Cairne Bloodhoof should be destroyed and Baine Bloodhoof should be summoned
        expect(boardB.child.cards.length).toBe(1); // Baine Bloodhoof summoned
        const cardG = boardB.child.cards.find(item => item instanceof BaineBloodhoofModel);
        expect(cardG).toBeDefined();
        if (!cardG) throw new Error();
        expect(cardG.child.attack.state.current).toBe(5); // Baine: 5/5
        expect(cardG.child.health.state.current).toBe(5);

        // Fireball should be consumed
        expect(handA.child.cards.length).toBe(0); // Fireball consumed
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6
    });

    test('wisp-attack', async () => {
        // Check that Wisp cannot attack hero due to Baine Bloodhoof's Taunt
        expect(boardA.child.cards.length).toBe(1); // Wisp on board
        expect(boardB.child.cards.length).toBe(1); // Baine Bloodhoof on board
        expect(cardD.child.attack.state.current).toBe(1); // Wisp: 1/1
        expect(cardD.child.health.state.current).toBe(1);


        const cardG2 = boardB.child.cards.find(item => item instanceof BaineBloodhoofModel);
        if (!cardG2) throw new Error();

        // Try to attack with Wisp
        const promise = cardD.child.action.run();
        expect(playerA.controller.current?.options).toContain(heroB); // Can target enemy hero
        expect(playerA.controller.current?.options).toContain(cardG2);
        playerA.controller.set(cardG2); // Target Baine Bloodhoof
        await promise;

        // Baine Bloodhoof should take 1 damage
        expect(cardG2.child.health.state.current).toBe(4); // 5 - 1 = 4
        expect(cardD.child.dispose.status).toBe(true);
    });
});
