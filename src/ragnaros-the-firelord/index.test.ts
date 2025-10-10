/**
 * Test cases for Ragnaros the Firelord
 * 
 * Initial state: Player A has Ragnaros the Firelord in hand.
 * Player B has no minions on board.
 * 
 * 1. ragnaros-the-firelord-play: Player A plays Ragnaros the Firelord.
 * 2. turn-end: At the end of Player A's turn, Ragnaros deals 8 damage to Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { RagnarosTheFirelordModel } from "./index";
import { boot } from "../boot";

describe('ragnaros-the-firelord', () => {
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
                            minions: [new RagnarosTheFirelordModel()],
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
    const handA = playerA.child.hand;
    const cardC = handA.refer.queue?.find(item => item instanceof RagnarosTheFirelordModel);
    if (!cardC) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;

    test('ragnaros-the-firelord-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(8); // Ragnaros: 8/8
        expect(roleC.child.health.state.current).toBe(8);
        expect(handA.refer.queue?.length).toBe(1); // Ragnaros in hand
        expect(boardA.refer.queue?.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Ragnaros the Firelord
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Ragnaros should be on board
        expect(boardA.refer.queue?.length).toBe(1); // Ragnaros on board
        expect(handA.refer.queue?.length).toBe(0); // Ragnaros moved to board
        expect(playerA.child.mana.state.current).toBe(2); // 10 - 8 = 2

        // Check that Ragnaros cannot attack
        expect(roleC.child.action.state.isLock).toBe(true); // Cannot attack
        expect(roleC.child.action.status).toBe(false); // Action is disabled
    });

    test('turn-end', async () => {
        // Check initial state
        expect(roleB.child.health.state.current).toBe(30); // Player B hero: 30 health
        expect(boardA.refer.queue?.length).toBe(1); // Ragnaros on board

        // End Player A's turn - Ragnaros should deal 8 damage to Player B's hero
        game.child.turn.next();

        // Check that Player B's hero took 8 damage
        expect(roleB.child.health.state.current).toBe(22); // 30 - 8 = 22
    });
});
