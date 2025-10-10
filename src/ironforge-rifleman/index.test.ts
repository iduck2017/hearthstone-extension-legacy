/**
 * Test cases for Ironforge Rifleman
 * 
 * Initial state: Player A has Ironforge Rifleman in hand.
 * Player B has 30 health.
 * 
 * 1. ironforge-rifleman-play: Player A plays Ironforge Rifleman, dealing 1 damage to Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { IronforgeRiflemanModel } from "./index";
import { boot } from "../boot";

describe('ironforge-rifleman', () => {
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
                            minions: [new IronforgeRiflemanModel()],
                            spells: []
                        }
                    })),
                    deck: new DeckModel(() => ({
                        child: { minions: [] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
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
                            spells: []
                        }
                    }))
                }
            }))
        }
    }));
    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const handA = playerA.child.hand;
    const cardC = handA.refer.queue?.find(item => item instanceof IronforgeRiflemanModel);
    if (!cardC) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;

    test('ironforge-rifleman-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(2); // Ironforge Rifleman: 2/2
        expect(roleC.child.health.state.current).toBe(2);
        expect(handA.refer.queue?.length).toBe(1); // Ironforge Rifleman in hand
        expect(boardA.refer.queue?.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana
        expect(roleB.child.health.state.current).toBe(30); // Player B hero: 30 health

        // Play Ironforge Rifleman
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await TimeUtil.sleep();
        
        // Choose target for battlecry
        expect(SelectUtil.current?.options).toContain(roleA); // Can target friendly hero
        expect(SelectUtil.current?.options).toContain(roleB); // Can target enemy hero
        SelectUtil.set(roleB); // Target Player B's hero for damage
        await promise;

        // Ironforge Rifleman should be on board
        expect(boardA.refer.queue?.length).toBe(1); // Ironforge Rifleman on board
        expect(handA.refer.queue?.length).toBe(0); // Ironforge Rifleman moved to board
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 = 7

        // Player B's hero should be damaged by 1
        expect(roleB.child.health.state.current).toBe(29); // 30 - 1 = 29
    });
});
