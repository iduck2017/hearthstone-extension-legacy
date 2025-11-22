/**
 * Test cases for Mass Dispel
 * 
 * Initial state: Player A has Mass Dispel in hand and deck with cards.
 * Player B has buffed minions on board.
 * 
 * 1. mass-dispel-cast: Player A casts Mass Dispel, silencing all enemy minions and drawing a card.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { MassDispelModel } from "./index";
import { WaterElementalModel } from "../../mage/water-elemental";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";

describe('mass-dispel', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
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
                            cards: [new MassDispelModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { cards: [new WispModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new WaterElementalModel()]
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
    const deckA = playerA.child.deck;
    const cardC = handA.child.cards.find(item => item instanceof MassDispelModel);
    const cardD = boardB.child.cards.find(item => item instanceof WaterElementalModel);
    if (!cardC || !cardD) throw new Error();
    const heroA = playerA.child.hero;

    test('mass-dispel-cast', async () => {
        // Cast Mass Dispel
        let promise = cardC.play();
        await promise;

        // All enemy minions should be silenced
        expect(cardD.child.attack.state.current).toBe(3); // Still 3/6
        expect(cardD.child.health.state.current).toBe(6);

        // Player A should draw a card
        expect(deckA.child.cards.length).toBe(0); // Deck is empty
        expect(handA.child.cards.length).toBe(1); // Wisp drawn to hand (Mass Dispel consumed, Wisp drawn)
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6
    });

    test('water-element-attack', async () => {
        game.child.turn.next();
        
        // Water Elemental attacks Player A hero again
        let promise = cardD.child.action.run();
        await CommonUtil.sleep();
        expect(playerB.controller.current?.options).toContain(heroA);
        playerB.controller.set(heroA);
        await promise;

        // Player A should take 3 damage but NOT be frozen (silenced Water Elemental lost freeze ability)
        expect(heroA.child.health.state.current).toBe(27); 
        expect(heroA.child.frozen.state.isEnabled).toBe(false); // Should NOT be frozen
    });
    
});
