/**
 * Test cases for Shield Slam
 * 
 * - initial-state:
 *   - Player A has Shield Slam and Shield Block in hand
 *   - Player A hero has 0 armor
 *   - Player B has Shield Slam in hand
 *   - Player B hero has 0 armor
 *   - Player A has Wisp (1/1) on board
 *   - Player B has Wisp (1/1) on board
 * - shield-block-play:
 *   - Player A plays Shield Block to gain 5 armor
 *   - Assert: Player A hero has 5 armor
 * - shield-slam-cast:
 *   - Player A casts Shield Slam on Player B's Wisp
 *   - Assert: Wisp is destroyed (takes 5 damage)
 * - turn-next:
 *   - Turn switches to Player B
 * - shield-slam-cast:
 *   - Player B casts Shield Slam on Player A's Wisp
 *   - Assert: Wisp takes 0 damage (Player B has no armor)
 *   - Assert: Wisp health is 1
 */
import { BoardModel, GameModel, HandModel, MageModel, ManaModel, PlayerModel, WarriorModel, DeckModel, CommonUtil } from "hearthstone-core";
import { ShieldSlamModel } from ".";
import { ShieldBlockModel } from "../shield-block";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";

describe('shield-slam', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new WarriorModel(),
                    board: new BoardModel({
                        child: { cards: [new WispModel()] }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new ShieldSlamModel(), new ShieldBlockModel()]
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
                    board: new BoardModel({
                        child: { 
                            cards: [new WispModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new ShieldSlamModel()]
                        }
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
    const handA = playerA.child.hand;
    const handB = playerB.child.hand;
    const heroA = playerA.child.hero;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    
    const cardC = handA.child.cards.find(item => item instanceof ShieldSlamModel);
    const cardD = handA.child.cards.find(item => item instanceof ShieldBlockModel);
    const cardE = handB.child.cards.find(item => item instanceof ShieldSlamModel);
    const cardF = boardA.child.cards.find(item => item instanceof WispModel);
    const cardG = boardB.child.cards.find(item => item instanceof WispModel);
    
    if (!cardC || !cardD || !cardE || !cardF || !cardG) throw new Error();

    // initial-state:
    // - Player A has Shield Slam and Shield Block in hand
    // - Player A hero has 0 armor
    // - Player B has Shield Slam in hand
    // - Player B hero has 0 armor
    // - Player A has Wisp (1/1) on board
    // - Player B has Wisp (1/1) on board

    test('shield-block-play', async () => {
        // Player A plays Shield Block to gain 5 armor
        await cardD.play();

        // Assert: Player A hero has 5 armor
        expect(heroA.child.armor.state.current).toBe(5);
    });

    test('shield-slam-cast', async () => {
        // Player A casts Shield Slam on Player B's Wisp
        let promise = cardC.play();
        await CommonUtil.sleep();
        
        // Select target Player B's Wisp
        playerA.controller.set(cardG);
        await promise;

        // Assert: Wisp is destroyed (takes 5 damage)
        expect(cardG.child.dispose.state.isActived).toBe(true);
    });

    test('turn-next', () => {
        // Turn switches to Player B
        game.child.turn.next();
        // Assert: Current turn is Player B
        expect(game.child.turn.refer.current).toBe(playerB);
    });

    test('shield-slam-cast', async () => {
        // Player B casts Shield Slam on Player A's Wisp
        let promise = cardE.play();
        await CommonUtil.sleep();
        
        // Select target Player A's Wisp
        playerB.controller.set(cardF);
        await promise;

        // Assert: Wisp takes 0 damage (Player B has no armor)
        expect(cardF.child.health.state.damage).toBe(0);
        // Assert: Wisp health is 1
        expect(cardF.child.health.state.current).toBe(1);
    });
});

