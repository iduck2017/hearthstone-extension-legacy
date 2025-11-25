/**
 * Test cases for Avenging Wrath
 *
 * 1. initial-state:
 *    - Player A has Ogre Magi (Spell Damage +1) on board
 *    - Player A has Avenging Wrath in hand
 *    - Player B has hero with 30 health
 * 2. avenging-wrath-cast:
 *    - Player A uses Avenging Wrath
 *    - Assert: Player B's hero takes 9 damage (8 + 1 spell damage)
 *    - Assert: Player B's hero health is 21 (30 - 9)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { AvengingWrathModel } from "./index";
import { OgreMagiModel } from "../../neutral/ogre-magi";
import { boot } from "../../boot";

describe('avenging-wrath', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: {
                            cards: [new OgreMagiModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: {
                            cards: [new AvengingWrathModel()]
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
                    hand: new HandModel({
                        child: { cards: [] }
                    }),
                    deck: new DeckModel({
                        child: { cards: [] }
                    })
                }
            })
        }
    });

    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const heroB = playerB.child.hero;
    const handA = playerA.child.hand;

    const cardC = handA.child.cards.find(item => item instanceof AvengingWrathModel);
    if (!cardC) throw new Error();

    test('avenging-wrath-cast', async () => {
        expect(heroB.child.health.state.current).toBe(30);

        // Player A uses Avenging Wrath
        await cardC.play();

        // Assert: Player B's hero takes 9 damage (8 + 1 spell damage from Ogre Magi)
        expect(heroB.child.health.state.current).toBe(21);
    });
});

