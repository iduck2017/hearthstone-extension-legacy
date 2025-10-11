/**
 * Test cases for Injured Blademaster
 * 
 * Initial state: Player A has Injured Blademaster in hand.
 * Player B has empty board.
 * 
 * 1. injured-blademaster-play: Player A plays Injured Blademaster, dealing 4 damage to himself.
 * 2. earthen-ring-farseer-heal: Player A plays Earthen Ring Farseer to heal Injured Blademaster.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { InjuredBlademasterModel } from "./index";
import { EarthenRingFarseerModel } from "../earthen-ring-farseer";
import { boot } from "../boot";

describe('injured-blademaster', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [] }
                    }),
                    hand: new HandModel({
                        child: { 
                            minions: [new InjuredBlademasterModel(), new EarthenRingFarseerModel()],
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
                        child: { minions: [] }
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
    const cardC = handA.refer.queue?.find(item => item instanceof InjuredBlademasterModel);
    const cardD = handA.refer.queue?.find(item => item instanceof EarthenRingFarseerModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('injured-blademaster-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(4); // Injured Blademaster: 4/7
        expect(roleC.child.health.state.current).toBe(7);
        expect(handA.refer.queue?.length).toBe(2); // Injured Blademaster in hand
        expect(boardA.refer.queue?.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Injured Blademaster
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Injured Blademaster should be on board
        expect(boardA.refer.queue?.length).toBe(1); // Injured Blademaster on board
        expect(handA.refer.queue?.length).toBe(1); // Injured Blademaster moved to board
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 = 7

        // Injured Blademaster should have taken 4 damage (7 - 4 = 3)
        expect(roleC.child.health.state.current).toBe(3); // Injured Blademaster: 4/3 (damaged)
        expect(roleC.child.health.state.damage).toBe(4);
        expect(roleC.child.health.state.origin).toBe(7);
        expect(roleC.child.health.state.maximum).toBe(7);
    });

    test('earthen-ring-farseer-heal', async () => {
        // Check initial state
        expect(roleC.child.health.state.current).toBe(3); // Injured Blademaster: 4/3 (damaged)
        expect(handA.refer.queue?.length).toBe(1); // Earthen Ring Farseer in hand
        expect(boardA.refer.queue?.length).toBe(1); // Injured Blademaster on board
        expect(playerA.child.mana.state.current).toBe(7); // 7 mana

        // Play Earthen Ring Farseer
        let promise = cardD.play();
        SelectUtil.set(0); // Select position 0
        await TimeUtil.sleep();
        // Choose target for battlecry (heal Injured Blademaster)
        expect(SelectUtil.current?.options).toContain(roleC); // Can target Injured Blademaster
        expect(SelectUtil.current?.options).toContain(roleA); // Can target Player A's hero
        expect(SelectUtil.current?.options).toContain(roleB); // Can target Player B's hero
        SelectUtil.set(roleC); // Target Injured Blademaster
        await promise;

        // Earthen Ring Farseer should be on board
        expect(boardA.refer.queue?.length).toBe(2); // Injured Blademaster + Earthen Ring Farseer on board
        expect(handA.refer.queue?.length).toBe(0); // Earthen Ring Farseer moved to board
        expect(playerA.child.mana.state.current).toBe(4); // 7 - 3 = 4

        // Injured Blademaster should be healed (3 + 3 = 6)
        expect(roleC.child.health.state.current).toBe(6); // Injured Blademaster: 4/6 (healed)
        expect(roleC.child.health.state.damage).toBe(1); // 7 - 6 = 1 damage remaining
    });
});
