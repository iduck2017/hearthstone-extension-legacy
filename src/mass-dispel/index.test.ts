/**
 * Test cases for Mass Dispel
 * 
 * Initial state: Player A has Mass Dispel in hand and deck with cards.
 * Player B has buffed minions on board.
 * 
 * 1. mass-dispel-cast: Player A casts Mass Dispel, silencing all enemy minions and drawing a card.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { MassDispelModel } from "./index";
import { WaterElementalModel } from "../water-elemental";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('mass-dispel', () => {
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
                            minions: [],
                            spells: [new MassDispelModel()]
                        }
                    })),
                    deck: new DeckModel(() => ({
                        child: { minions: [new WispModel()] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { 
                            minions: [new WaterElementalModel()]
                        }
                    })),
                    hand: new HandModel(() => ({
                        child: { spells: [] }
                    }))
                }
            }))
        }
    }));
    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    const deckA = playerA.child.deck;
    const cardC = handA.child.spells.find(item => item instanceof MassDispelModel);
    const cardD = boardB.child.minions.find(item => item instanceof WaterElementalModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleD = cardD.child.role;

    test('mass-dispel-cast', async () => {
        // Cast Mass Dispel
        let promise = cardC.play();
        await promise;

        // All enemy minions should be silenced
        expect(roleD.child.attack.state.current).toBe(3); // Still 3/6
        expect(roleD.child.health.state.current).toBe(6);

        // Player A should draw a card
        expect(deckA.refer.order.length).toBe(0); // Deck is empty
        expect(handA.refer.order.length).toBe(1); // Wisp drawn to hand

        // Mass Dispel should be consumed
        expect(handA.child.spells.length).toBe(0); // Mass Dispel consumed
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6
    });

    test('water-element-attack', async () => {
        game.child.turn.next();
        
        // Water Elemental attacks Player A hero again
        let promise = roleD.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleA);
        SelectUtil.set(roleA);
        await promise;

        // Player A should take 3 damage but NOT be frozen (silenced Water Elemental lost freeze ability)
        expect(roleA.child.health.state.current).toBe(27); 
        expect(roleA.child.feats.child.frozen.state.isActive).toBe(false); // Should NOT be frozen
    });
    
});
