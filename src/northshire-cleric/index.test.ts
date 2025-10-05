/**
 * Test cases for Northshire Cleric
 * 
 * Initial state: Player A has Northshire Cleric on board, Circle of Healing in hand, and 5 Wisps in deck.
 * Player B has 2 Mana Wyrms on board.
 * 
 * 1. northshire-cleric-attack: Northshire Cleric attacks Mana Wyrm, both get damaged
 * 2. circle-of-healing-cast: Player A uses Circle of Healing, heals all minions, draws 2 cards
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil } from "hearthstone-core";
import { NorthshireClericModel } from "./index";
import { CircleOfHealingModel } from "../circle-of-healing";
import { ManaWyrmModel } from "../mana-wyrm";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('northshire-cleric', () => {
    const game = new GameModel(() => ({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new NorthshireClericModel()] }
                    })),
                    hand: new HandModel(() => ({
                        child: { 
                            minions: [],
                            spells: [new CircleOfHealingModel()]
                        }
                    })),
                    deck: new DeckModel(() => ({
                        child: { 
                            minions: [
                                new WispModel(), 
                                new WispModel(), 
                                new WispModel(),
                                new WispModel(),
                                new WispModel()
                            ]
                        }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { 
                            minions: [new ManaWyrmModel(), new ManaWyrmModel()]
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
    const cardC = boardA.child.minions.find(item => item instanceof NorthshireClericModel);
    const cardE = boardB.child.minions.find(item => item instanceof ManaWyrmModel);
    const cardD = handA.child.spells.find(item => item instanceof CircleOfHealingModel);
    const roleC = cardC?.child.role;
    const roleE = cardE?.child.role;
    if (!roleC || !roleE || !cardD) throw new Error();

    test('northshire-cleric-attack', async () => {
        // Check initial stats
        expect(roleC.child.attack.state.current).toBe(1); // Cleric: 1/3
        expect(roleC.child.health.state.current).toBe(3);
        expect(roleE.child.attack.state.current).toBe(1); // Mana Wyrm: 1/3
        expect(roleE.child.health.state.current).toBe(3);

        // Northshire Cleric attacks first Mana Wyrm
        const promise = roleC.child.action.run();
        expect(SelectUtil.current?.options).toContain(roleE);
        SelectUtil.set(roleE);
        await promise;

        // Both should be damaged
        expect(roleC.child.health.state.current).toBe(2); // 3 - 1 damage
        expect(roleE.child.health.state.current).toBe(2); // 3 - 1 damage
    });

    test('circle-of-healing-cast', async () => {
        // Check stats after attack
        expect(roleC.child.health.state.current).toBe(2); // Damaged
        expect(roleE.child.health.state.current).toBe(2); // Damaged

        // Check initial hand and deck size
        expect(handA.refer.order.length).toBe(1); // Only Circle of Healing
        expect(deckA.refer.order.length).toBe(5); // 5 Wisps

        // Player A uses Circle of Healing
        const promise = cardD.play();
        await promise;

        // All minions should be healed
        expect(roleC.child.health.state.current).toBe(3); // 2 + 4 = 3 (capped at max)
        expect(roleE.child.health.state.current).toBe(3); // 2 + 4 = 3 (capped at max)

        // Player A should have drawn 2 cards (one for each minion healed)
        expect(handA.refer.order.length).toBe(2); 
        expect(deckA.refer.order.length).toBe(3); // 5 - 2 = 3 (2 cards drawn from deck)

        expect(playerA.child.mana.state.current).toBe(10); // 10 - 0 cost
    });
});
