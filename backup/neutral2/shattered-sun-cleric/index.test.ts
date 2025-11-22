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
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { ShatteredSunClericModel } from "./index";
import { WispModel } from '../wisp';
import { boot } from '../../boot';

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
                            cards: [new WispModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new ShatteredSunClericModel()]
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
                            cards: []
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new ShatteredSunClericModel(), new WispModel()]
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
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    const handB = playerB.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof ShatteredSunClericModel);
    const cardD = boardA.child.cards.find(item => item instanceof WispModel);
    const cardE = handB.child.cards.find(item => item instanceof ShatteredSunClericModel);
    const cardF = handB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD || !cardE || !cardF) throw new Error();
    const heroB = playerB.child.hero;

    test('shattered-sun-cleric-battlecry', async () => {
        // Check initial state
        expect(cardD.child.attack.state.current).toBe(1); // Wisp: 1/1
        expect(cardD.child.health.state.current).toBe(1);
        expect(boardA.child.cards.length).toBe(1); // Wisp on board
        expect(handA.child.cards.length).toBe(1); // Shattered Sun Cleric in hand

        // Play Shattered Sun Cleric
        let promise = cardC.play();
        await AnimeUtil.pause();
        expect(playerA.controller.current?.options).toContain(0); // Select position 0
        playerA.controller.set(0);
        await AnimeUtil.pause();
        
        // Choose target for battlecry (Wisp)
        expect(playerA.controller.current?.options).toContain(cardD); // Can target Wisp
        expect(playerA.controller.current?.options.length).toBe(1); // Only Wisp available
        playerA.controller.set(cardD); // Target Wisp
        await promise;
        
        // Shattered Sun Cleric should be on board
        expect(boardA.child.cards.length).toBe(2); // Wisp + Shattered Sun Cleric on board
        expect(handA.child.cards.length).toBe(0); // Shattered Sun Cleric moved to board
        
        // Wisp should be buffed to 2/2
        expect(cardD.child.attack.state.current).toBe(2); // Wisp: 2/2 (buffed)
        expect(cardD.child.health.state.current).toBe(2);
        expect(cardD.child.attack.state.origin).toBe(1);
        expect(cardD.child.health.state.origin).toBe(1);
    });

    test('shattered-sun-cleric-play', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);
        
        // Player B has no minions on board, so battlecry cannot trigger
        expect(boardB.child.cards.length).toBe(0);
        expect(handB.child.cards.length).toBe(2); // Shattered Sun Cleric + Wisp in hand
        
        // Play Shattered Sun Cleric (no targets available)
        let promise = cardE.play();
        await AnimeUtil.pause();
        expect(playerB.controller.current?.options).toContain(0); // Select position 0
        playerB.controller.set(0);
        await AnimeUtil.pause();
        expect(playerB.controller.current).toBeUndefined(); // No battlecry targets
        await promise;
        
        // Shattered Sun Cleric should be on board
        expect(boardB.child.cards.length).toBe(1);
        expect(handB.child.cards.length).toBe(1); // Only Wisp left in hand
        
        // Play Wisp
        promise = cardF.play();
        await AnimeUtil.pause();
        expect(playerB.controller.current?.options).toContain(0); // Select position 0
        playerB.controller.set(0);
        await promise;

        // Both minions should be on board
        expect(boardB.child.cards.length).toBe(2);
        expect(handB.child.cards.length).toBe(0);
        expect(cardF.child.attack.state.current).toBe(1); // Wisp: 1/1
        expect(cardF.child.health.state.current).toBe(1);
    });

    test('wisp-attack', async () => {
        // Turn to Player A
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerA);

        // Check initial state
        expect(cardD.child.attack.state.current).toBe(2); // Buffed Wisp: 2/2
        expect(cardD.child.health.state.current).toBe(2);
        expect(cardF.child.attack.state.current).toBe(1); // Player B's Wisp: 1/1
        expect(cardF.child.health.state.current).toBe(1);
        expect(boardA.child.cards.length).toBe(2); // Wisp + Shattered Sun Cleric on board
        expect(boardB.child.cards.length).toBe(2); // Wisp + Shattered Sun Cleric on board

        // Player A's buffed Wisp attacks Player B's Wisp
        let promise = cardD.child.action.run();
        await AnimeUtil.pause();
        expect(playerA.controller.current?.options).toContain(cardF); // Can target Player B's Wisp
        expect(playerA.controller.current?.options).toContain(heroB); // Can target Player B's hero
        expect(playerA.controller.current?.options).toContain(cardE); // Can target Player B's Shattered Sun Cleric
        expect(playerA.controller.current?.options.length).toBe(3);
        playerA.controller.set(cardF); // Target Player B's Wisp
        await promise;
        
        // Player A's Wisp should survive (2/2 vs 1/1)
        expect(cardD.child.attack.state.current).toBe(2);
        expect(cardD.child.health.state.current).toBe(1); // 2 - 1 = 1
        expect(cardD.child.health.state.damage).toBe(1);
        
        // Player B's Wisp should die (1/1 vs 2/2)
        expect(cardF.child.attack.state.current).toBe(1);
        expect(cardF.child.health.state.current).toBe(-1); // 1 - 2 = -1
        expect(cardF.child.health.state.damage).toBe(2);
        expect(cardF.child.dispose.status).toBe(true);
        
        // Board state
        expect(boardA.child.cards.length).toBe(2); // Wisp + Shattered Sun Cleric on board
        expect(boardB.child.cards.length).toBe(1); // Only Shattered Sun Cleric on board
    });
});


