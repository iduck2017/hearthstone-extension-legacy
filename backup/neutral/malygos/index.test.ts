/**
 * Test cases for Malygos
 * 
 * Initial state: Player A has Malygos on board. Player B has empty board.
 * 
 * 1. arcane-missiles-cast: Player A casts Arcane Missiles with Malygos on board, dealing 1+5=6 damage to Player B's hero.
 * 2. fireball-cast: Player A casts Fireball with Malygos on board, dealing 6+5=11 damage to Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { MalygosModel } from "./index";
import { ArcaneMissilesModel } from "../../mage/arcane-missiles";
import { FireballModel } from "../../mage/fireball";
import { boot } from "../../boot";

describe('malygos', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new MalygosModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new ArcaneMissilesModel(), new FireballModel()]
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
                            cards: []
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
    const handA = playerA.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof ArcaneMissilesModel);
    const cardD = handA.child.cards.find(item => item instanceof FireballModel);
    const cardE = boardA.child.cards.find(item => item instanceof MalygosModel);
    if (!cardC || !cardD || !cardE) throw new Error();
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;

    test('arcane-missiles-cast', async () => {
        // Check initial state
        expect(cardE.child.attack.state.current).toBe(4); // Malygos: 4/12
        expect(cardE.child.health.state.current).toBe(12);
        expect(boardA.child.cards.length).toBe(1); // Malygos on board
        expect(handA.child.cards.filter(item => item instanceof ArcaneMissilesModel).length).toBe(1);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(heroB.child.health.state.current).toBe(30); // Player B hero: 30 health

        // Player A casts Arcane Missiles with Malygos on board
        await cardC.play(); // Arcane Missiles doesn't require target selection
        // await AnimeUtil.sleep()

        console.log(heroB.child.health.state)
        // Arcane Missiles should deal 3+5=8 damage (3 base + 5 from Malygos)
        expect(heroB.child.health.state.current).toBe(22); // 30 - 8 = 22
        expect(playerA.child.mana.state.current).toBe(9); // 10 - 1 cost (Arcane Missiles costs 1)
        expect(handA.child.cards.length).toBe(1);
    });

    // test('fireball-cast', async () => {
    //     // Check initial state
    //     expect(heroB.child.health.state.current).toBe(22); // Player B hero: 22 health (from previous test)
    //     expect(handA.child.cards.filter(item => item instanceof FireballModel).length).toBe(1);
    //     expect(playerA.child.mana.state.current).toBe(9);

    //     // Player A casts Fireball with Malygos on board
    //     const promise = cardD.play();
    //     expect(playerA.controller.current?.options).toContain(heroA); // Can target friendly hero
    //     expect(playerA.controller.current?.options).toContain(heroB); // Can target enemy hero
    //     playerA.controller.set(heroB); // Target Player B's hero
    //     await promise;

    //     // Fireball should deal 6+5=11 damage (6 base + 5 from Malygos)
    //     expect(heroB.child.health.state.current).toBe(11); // 22 - 11 = 11
    //     expect(playerA.child.mana.state.current).toBe(5); // 9 - 4 cost (Fireball costs 4)
    //     expect(handA.child.cards.filter(item => item instanceof FireballModel).length).toBe(0);
    // });
});
