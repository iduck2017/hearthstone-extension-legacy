/**
 * Test cases for Commanding Shout
 *
 * 1. initial-state:
 *    - Player A has Chillwind Yeti (4/5) on board
 *    - Player A has Commanding Shout in hand
 *    - Player A deck has Fireball cards available to draw
 * 2. commanding-shout-cast:
 *    - Player A uses Commanding Shout
 *    - Assert: Player A's hand size remains 1 (consumed 1, drew 1)
 * 3. fireball-cast:
 *    - Player A uses Fireball on Player A's Yeti (deal 6 damage)
 *    - Assert: Yeti health is 1 (protected from being reduced below 1)
 * 4. fireball-cast:
 *    - Turn switches to Player B, then back to Player A
 *    - Assert: Protection effect is disabled
 *    - Player A uses Fireball on Player A's Yeti again (deal 6 damage)
 *    - Assert: Yeti is destroyed (protection effect expired)
 */
import { GameModel, PlayerModel, BoardModel, HandModel, ManaModel, DeckModel, MageModel } from "hearthstone-core";
import { CommandingShoutModel } from "./index";
import { ChillwindYetiModel } from "../../neutral/chillwind-yeti";
import { FireballModel } from "../../mage/fireball";
import { boot } from "../../boot";
import { DebugUtil } from "set-piece";

describe('commanding-shout', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new ChillwindYetiModel()] }
                    }),
                    hand: new HandModel({
                        child: { cards: [new CommandingShoutModel()] }
                    }),
                    deck: new DeckModel({
                        child: { cards: [new FireballModel(), new FireballModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
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
    const handA = playerA.child.hand;
    const deckA = playerA.child.deck;
    const turn = game.child.turn;

    const cardC = boardA.child.cards.find(item => item instanceof ChillwindYetiModel);
    const cardD = handA.child.cards.find(item => item instanceof CommandingShoutModel);
    if (!cardC || !cardD) throw new Error();


    // Player A uses Commanding Shout and draws 1 card
    test('commanding-shout-cast', async () => {
        // Assert: Player A has 2 cards in hand (Commanding Shout + Fireball drawn at turn start)
        console.log(handA.child.cards.map(item => item.name));
        expect(handA.child.cards.length).toBe(2);
        
        // Player A uses Commanding Shout
        let promise = cardD.play();
        await promise;
        
        // Assert: Player A's hand size remains 2 (consumed 1, drew 1)
        expect(handA.child.cards.length).toBe(2);
        expect(cardC.child.health.state.minimum).toBe(1)
    });

    // Cast Fireball on Player A's Yeti; health should be clamped to 1 this turn
    test('fireball-cast', async () => {
        const cardE = handA.child.cards.find(item => item instanceof FireballModel);
        if (!cardE || !cardC) throw new Error();
        
        // Player A casts Fireball on Yeti
        let promise = cardE.play();
        playerA.controller.set(cardC);
        await promise;
        
        // Assert: Yeti health is 1 (protected from being reduced below 1)
        expect(cardC.child.health.state.current).toBe(1);
        // Assert: Yeti is still on board
        expect(boardA.child.cards).toContain(cardC);
    });

    // End Player A's turn, then return to Player A to expire protection, then cast Fireball again on Yeti
    test('fireball-cast', async () => {
        // Turn switches to Player B
        turn.next();
        // Assert: Current turn is Player B
        expect(turn.refer.current).toBe(playerB);
        
        // Turn switches back to Player A
        turn.next();
        // Assert: Current turn is Player A (protection effect is disabled)
        expect(turn.refer.current).toBe(playerA);
        
        const cardF = handA.child.cards.find(item => item instanceof FireballModel);
        if (!cardF || !cardC) throw new Error();
        
        // Player A casts Fireball on Yeti again
        let promise = cardF.play();
        playerA.controller.set(cardC);
        await promise;
        
        // Assert: Yeti is destroyed (protection effect expired)
        expect(boardA.child.cards).not.toContain(cardC);
    });
});

