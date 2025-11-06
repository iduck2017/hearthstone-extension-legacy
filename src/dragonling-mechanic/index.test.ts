/**
 * Test cases for Dragonling Mechanic
 * 
 * Initial state: Player A has Dragonling Mechanic in hand.
 * Player B has empty board.
 * 
 * 1. dragonling-mechanic-play: Player A plays Dragonling Mechanic, summoning a Mechanical Dragonling.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { DragonlingMechanicModel } from "./index";
import { MechanicalDragonlingModel } from "../mechanical-dragonling";
import { boot } from "../boot";

describe('dragonling-mechanic', () => {
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
                            minions: [new DragonlingMechanicModel()],
                            spells: []
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
                        child: { 
                            minions: [],
                            spells: []
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
    const cardC = handA.refer.queue.find(item => item instanceof DragonlingMechanicModel);
    if (!cardC) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;

    test('dragonling-mechanic-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(2); // Dragonling Mechanic: 2/4
        expect(roleC.child.health.state.current).toBe(4);
        expect(handA.refer.queue.length).toBe(1); // Dragonling Mechanic in hand
        expect(boardA.refer.queue.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Dragonling Mechanic
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Dragonling Mechanic should be on board
        expect(boardA.refer.queue.length).toBe(2); // Dragonling Mechanic + Mechanical Dragonling on board
        expect(handA.refer.queue.length).toBe(0); // Dragonling Mechanic moved to board
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6

        // Check that Mechanical Dragonling was summoned
        const cardD = boardA.refer.queue.find(item => item instanceof MechanicalDragonlingModel);
        expect(cardD).toBeDefined(); // Should have summoned a Mechanical Dragonling
        const roleD = cardD?.child.role;
        if (!roleD) throw new Error();

        expect(boardA.refer.queue[1]).toBe(cardD);
        expect(boardA.refer.queue[0]).toBe(cardC);
        expect(roleD.child.attack.state.current).toBe(2); // Mechanical Dragonling: 2/1
        expect(roleD.child.health.state.current).toBe(1);
    });
});
