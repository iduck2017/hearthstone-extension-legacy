/**
 * Test cases for Shattered Sun Cleric
 * 
 * Initial state: Player A has Shattered Sun Cleric in hand and Wisp on board.
 * Player B has Shattered Sun Cleric and Wisp in hand.
 * 
 * 1. shattered-sun-cleric-battlecry: Player A plays Shattered Sun Cleric, buffing Wisp.
 * 2. shattered-sun-cleric-play: Player B plays Shattered Sun Cleric (no targets).
 * 3. wisp-attack: Player A's buffed Wisp attacks Player B's Wisp.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { ShatteredSunClericModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('shattered-sun-cleric', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            minions: [new WispModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            minions: [new ShatteredSunClericModel()],
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
                            minions: [new ShatteredSunClericModel(), new WispModel()],
                            spells: []
                        }
                    }),
                    deck: new DeckModel({
                        child: { minions: [] }
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
    const handB = playerB.child.hand;
    const cardC = handA.refer.queue.find(item => item instanceof ShatteredSunClericModel);
    const cardD = boardA.refer.queue.find(item => item instanceof WispModel);
    const cardE = handB.refer.queue.find(item => item instanceof ShatteredSunClericModel);
    const cardF = handB.refer.queue.find(item => item instanceof WispModel);
    if (!cardC || !cardD || !cardE || !cardF) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;
    const roleE = cardE.child.role;
    const roleF = cardF.child.role;

    test('shattered-sun-cleric-battlecry', async () => {
        // Check initial state
        expect(roleD.child.attack.state.current).toBe(1); // Wisp: 1/1
        expect(roleD.child.health.state.current).toBe(1);
        expect(boardA.refer.queue.length).toBe(1); // Wisp on board
        expect(handA.refer.queue.length).toBe(1); // Shattered Sun Cleric in hand

        // Play Shattered Sun Cleric
        let promise = cardC.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0); // Select position 0
        SelectUtil.set(0);
        await TimeUtil.sleep();
        
        // Choose target for battlecry (Wisp)
        expect(SelectUtil.current?.options).toContain(roleD); // Can target Wisp
        expect(SelectUtil.current?.options.length).toBe(1); // Only Wisp available
        SelectUtil.set(roleD); // Target Wisp
        await promise;
        
        // Shattered Sun Cleric should be on board
        expect(boardA.refer.queue.length).toBe(2); // Wisp + Shattered Sun Cleric on board
        expect(handA.refer.queue.length).toBe(0); // Shattered Sun Cleric moved to board
        
        // Wisp should be buffed to 2/2
        expect(roleD.child.attack.state.current).toBe(2); // Wisp: 2/2 (buffed)
        expect(roleD.child.health.state.current).toBe(2);
        expect(roleD.child.attack.state.origin).toBe(1);
        expect(roleD.child.health.state.origin).toBe(1);
    });

    test('shattered-sun-cleric-play', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);
        
        // Player B has no minions on board, so battlecry cannot trigger
        expect(boardB.refer.queue.length).toBe(0);
        expect(handB.refer.queue.length).toBe(2); // Shattered Sun Cleric + Wisp in hand
        
        // Play Shattered Sun Cleric (no targets available)
        let promise = cardE.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0); // Select position 0
        SelectUtil.set(0);
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeUndefined(); // No battlecry targets
        await promise;
        
        // Shattered Sun Cleric should be on board
        expect(boardB.refer.queue.length).toBe(1);
        expect(handB.refer.queue.length).toBe(1); // Only Wisp left in hand
        
        // Play Wisp
        promise = cardF.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0); // Select position 0
        SelectUtil.set(0);
        await promise;

        // Both minions should be on board
        expect(boardB.refer.queue.length).toBe(2);
        expect(handB.refer.queue.length).toBe(0);
        expect(roleF.child.attack.state.current).toBe(1); // Wisp: 1/1
        expect(roleF.child.health.state.current).toBe(1);
    });

    test('wisp-attack', async () => {
        // Turn to Player A
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerA);

        // Check initial state
        expect(roleD.child.attack.state.current).toBe(2); // Buffed Wisp: 2/2
        expect(roleD.child.health.state.current).toBe(2);
        expect(roleF.child.attack.state.current).toBe(1); // Player B's Wisp: 1/1
        expect(roleF.child.health.state.current).toBe(1);
        expect(boardA.refer.queue.length).toBe(2); // Wisp + Shattered Sun Cleric on board
        expect(boardB.refer.queue.length).toBe(2); // Wisp + Shattered Sun Cleric on board

        // Player A's buffed Wisp attacks Player B's Wisp
        let promise = roleD.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleF); // Can target Player B's Wisp
        expect(SelectUtil.current?.options).toContain(roleB); // Can target Player B's hero
        expect(SelectUtil.current?.options).toContain(roleE); // Can target Player B's Shattered Sun Cleric
        expect(SelectUtil.current?.options.length).toBe(3);
        SelectUtil.set(roleF); // Target Player B's Wisp
        await promise;
        
        // Player A's Wisp should survive (2/2 vs 1/1)
        expect(roleD.child.attack.state.current).toBe(2);
        expect(roleD.child.health.state.current).toBe(1); // 2 - 1 = 1
        expect(roleD.child.health.state.damage).toBe(1);
        
        // Player B's Wisp should die (1/1 vs 2/2)
        expect(roleF.child.attack.state.current).toBe(1);
        expect(roleF.child.health.state.current).toBe(-1); // 1 - 2 = -1
        expect(roleF.child.health.state.damage).toBe(2);
        expect(cardF.child.dispose.status).toBe(true);
        
        // Board state
        expect(boardA.refer.queue.length).toBe(2); // Wisp + Shattered Sun Cleric on board
        expect(boardB.refer.queue.length).toBe(1); // Only Shattered Sun Cleric on board
    });
});


