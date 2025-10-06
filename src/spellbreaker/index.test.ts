/**
 * Test cases for Spellbreaker
 * 
 * Initial state: Player A has Spellbreaker in hand.
 * Player B has a Silvermoon Guardian on board.
 * 
 * 1. spellbreaker-play: Player A plays Spellbreaker, silencing Player B's Silvermoon Guardian.
 * 2. silvermoon-attack: Next turn, Player B's Silvermoon Guardian attacks Spellbreaker, both die.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { SpellbreakerModel } from "./index";
import { SilvermoonGuardianModel } from "../silvermoon-guardian";
import { boot } from "../boot";

describe('spellbreaker', () => {
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
                            minions: [new SpellbreakerModel()],
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
                            minions: [new SilvermoonGuardianModel()]
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
    const cardC = handA.refer.order.find(item => item instanceof SpellbreakerModel);
    const cardD = boardB.refer.order.find(item => item instanceof SilvermoonGuardianModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('spellbreaker-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(4); // Spellbreaker: 4/3
        expect(roleC.child.health.state.current).toBe(3);
        expect(handA.refer.order.length).toBe(1); // Spellbreaker in hand
        expect(boardA.refer.order.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana
        expect(roleD.child.feats.child.divineShield).toBeDefined(); // Silvermoon Guardian has Divine Shield

        // Play Spellbreaker
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await TimeUtil.sleep();
        
        // Choose target for battlecry
        expect(SelectUtil.current?.options).toContain(roleD); // Can target Silvermoon Guardian
        expect(SelectUtil.current?.options).not.toContain(roleA); // Cannot target heroes
        expect(SelectUtil.current?.options).not.toContain(roleB); // Cannot target heroes
        SelectUtil.set(roleD); // Target Silvermoon Guardian for silence
        await promise;

        // Spellbreaker should be on board
        expect(boardA.refer.order.length).toBe(1); // Spellbreaker on board
        expect(handA.refer.order.length).toBe(0); // Spellbreaker moved to board
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6

        // Silvermoon Guardian should be silenced (Divine Shield removed)
        expect(roleD.child.feats.child.divineShield.state.isActive).toBe(false); // Divine Shield removed by silence
    });

    test('silvermoon-attack', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(roleC.child.health.state.current).toBe(3); // Spellbreaker: 4/3
        expect(roleD.child.health.state.current).toBe(3); // Silvermoon Guardian: 3/3 (silenced, no Divine Shield)
        expect(boardA.refer.order.length).toBe(1); // Spellbreaker on board
        expect(boardB.refer.order.length).toBe(1); // Silvermoon Guardian on board

        // Player B's Silvermoon Guardian attacks Spellbreaker
        let promise = roleD.child.action.run();
        expect(SelectUtil.current?.options).toContain(roleC); // Can target Spellbreaker
        expect(SelectUtil.current?.options).toContain(roleA); // Can target Player A's hero
        SelectUtil.set(roleC); // Target Spellbreaker
        await promise;

        // Both minions should die (3/3 vs 4/3)
        expect(boardA.refer.order.length).toBe(0); // Spellbreaker dies
        expect(boardB.refer.order.length).toBe(0); // Silvermoon Guardian dies
    });
});
