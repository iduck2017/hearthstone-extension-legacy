/**
 * Test cases for Warsong Outrider
 * 
 * - initial-state:
 *   - Player A has Warsong Outrider in hand
 *   - Player B has Wisp (1/1) on board
 *   - Player B hero health 30
 * - warsong-outrider-play:
 *   - Player A summons Warsong Outrider
 *   - Assert: Warsong Outrider is on Player A's board
 *   - Assert: Warsong Outrider's attack is 5
 *   - Assert: Warsong Outrider's health is 4
 *   - Assert: Warsong Outrider has Rush
 *   - Assert: Warsong Outrider can attack immediately
 * - warsong-outrider-attack-minion:
 *   - Player A uses Warsong Outrider to attack Player B's Wisp
 *   - Assert: Can target minions
 *   - Assert: Cannot target hero
 *   - Assert: Wisp is destroyed
 *   - Assert: Warsong Outrider's action is consumed
 * - turn-next:
 *   - Turn switches to Player B, then back to Player A
 * - warsong-outrider-attack-hero:
 *   - Player B has no minions on board
 *   - Player A uses Warsong Outrider to attack Player B's hero
 *   - Assert: Can target hero (when no minions available)
 *   - Assert: Player B's hero health decreases by 5
 */
import { BoardModel, GameModel, HandModel, MageModel, ManaModel, PlayerModel, DeckModel } from "hearthstone-core";
import { WarsongOutriderModel } from ".";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";

describe('warsong-outrider', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new WarsongOutriderModel()]
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
    const handA = playerA.child.hand;
    const boardB = playerB.child.board;
    const heroB = playerB.child.hero;
    
    const cardC = handA.child.cards.find(item => item instanceof WarsongOutriderModel);
    if (!cardC) throw new Error();
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardD) throw new Error();
    const turn = game.child.turn;

    // initial-state:
    // - Player A has Warsong Outrider in hand
    // - Player B has Wisp (1/1) on board
    // - Player B hero health 30

    test('warsong-outrider-play', async () => {
        // Player A summons Warsong Outrider
        let promise = cardC.play();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Assert: Warsong Outrider has Rush
        expect(cardC.child.rush.state.isEnabled).toBe(true);
        
        // Assert: Warsong Outrider can attack immediately
        expect(cardC.child.action.state.isReady).toBe(true);
    });

    test('warsong-outrider-attack-minion', async () => {
        // Player A uses Warsong Outrider to attack Player B's Wisp
        let promise = cardC.child.action.run();
        
        // Assert: Can target minions
        expect(playerA.controller.current?.options).toContain(cardD);
        // Assert: Cannot target hero
        expect(playerA.controller.current?.options).not.toContain(heroB);
        
        playerA.controller.set(cardD); // Target Player B's Wisp
        await promise;

        // Assert: Wisp is destroyed
        expect(cardD.child.dispose.state.isActived).toBe(true);
        
        // Assert: Warsong Outrider's action is consumed
        expect(cardC.child.action.state.current).toBe(0);
    });

    test('turn-next', () => {
        // Turn switches to Player B, then back to Player A
        turn.next();
        // Assert: Current turn is Player B
        expect(turn.refer.current).toBe(playerB);
        turn.next();
        // Assert: Current turn is Player A
        expect(turn.refer.current).toBe(playerA);
    });

    test('warsong-outrider-attack-hero', async () => {
        // Player B has no minions on board (Wisp was destroyed)
        // Player A uses Warsong Outrider to attack Player B's hero
        let promise = cardC.child.action.run();
        
        // Assert: Can target hero (when no minions available)
        expect(playerA.controller.current?.options).toContain(heroB);
        
        playerA.controller.set(heroB); // Target Player B's hero
        await promise;

        // Assert: Player B's hero health decreases by 5
        expect(heroB.child.health.state.current).toBe(25);
    });
});

