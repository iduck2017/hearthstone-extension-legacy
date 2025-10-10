/**
 * Test cases for Harvest Golem
 * 
 * Initial state: Player A has Harvest Golem in hand.
 * Player B has a Stranglethorn Tiger on board.
 * 
 * 1. harvest-golem-play: Player A plays Harvest Golem.
 * 2. harvest-golem-death: Player B's Stranglethorn Tiger attacks Harvest Golem, triggering deathrattle.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { HarvestGolemModel } from "./index";
import { DamagedGolemModel } from "../damaged-golem";
import { StranglethornTigerModel } from "../stranglethorn-tiger";
import { boot } from "../boot";

describe('harvest-golem', () => {
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
                            minions: [new HarvestGolemModel()],
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
                            minions: [new StranglethornTigerModel()]
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
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    const cardC = handA.refer.queue?.find(item => item instanceof HarvestGolemModel);
    const cardD = boardB.refer.queue?.find(item => item instanceof StranglethornTigerModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('harvest-golem-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(2); // Harvest Golem: 2/3
        expect(roleC.child.health.state.current).toBe(3);
        expect(handA.refer.queue?.length).toBe(1); // Harvest Golem in hand
        expect(boardA.refer.queue?.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Harvest Golem
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Harvest Golem should be on board
        expect(boardA.refer.queue?.length).toBe(1); // Harvest Golem on board
        expect(handA.refer.queue?.length).toBe(0); // Harvest Golem moved to board
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 = 7
    });

    test('harvest-golem-death', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(roleC.child.health.state.current).toBe(3); // Harvest Golem: 2/3
        expect(roleD.child.health.state.current).toBe(5); // Stranglethorn Tiger: 5/5
        expect(boardA.refer.queue?.length).toBe(1); // Harvest Golem on board
        expect(boardB.refer.queue?.length).toBe(1); // Stranglethorn Tiger on board

        // Player B's Stranglethorn Tiger attacks Harvest Golem
        let promise = roleD.child.action.run();
        expect(SelectUtil.current?.options).toContain(roleC); // Can target Harvest Golem
        expect(SelectUtil.current?.options).toContain(roleA); // Cannot target Player A's hero (Stealth)
        SelectUtil.set(roleC); // Target Harvest Golem
        await promise;

        // Harvest Golem should die (2/3 vs 5/5)
        expect(boardA.refer.queue?.length).toBe(1); // Damaged Golem summoned
        expect(cardC.child.dispose.status).toBe(true); // Harvest Golem dies
        
        // Check that Damaged Golem was summoned
        const cardE = boardA.refer.queue?.find(item => item instanceof DamagedGolemModel);
        expect(cardE).toBeDefined();
        if (cardE) {
            expect(cardE.child.role.child.attack.state.current).toBe(2); // Damaged Golem: 2/1
            expect(cardE.child.role.child.health.state.current).toBe(1);
        }
    });
});
