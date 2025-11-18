/**
 * Test cases for Ironforge Rifleman
 * 
 * Initial state: Player A has Ironforge Rifleman in hand.
 * Player B has 30 health.
 * 
 * 1. ironforge-rifleman-play: Player A plays Ironforge Rifleman, dealing 1 damage to Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { IronforgeRiflemanModel } from "./index";
import { boot } from '../../boot';

describe('ironforge-rifleman', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
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
                            cards: [new IronforgeRiflemanModel()]
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
                            cards: []
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
    const cardC = handA.child.cards.find(item => item instanceof IronforgeRiflemanModel);
    if (!cardC) throw new Error();
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;

    test('ironforge-rifleman-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(2); // Ironforge Rifleman: 2/2
        expect(cardC.child.health.state.current).toBe(2);
        expect(handA.child.cards.length).toBe(1); // Ironforge Rifleman in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana
        expect(heroB.child.health.state.current).toBe(30); // Player B hero: 30 health

        // Play Ironforge Rifleman
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await AnimeUtil.pause();
        
        // Choose target for battlecry
        expect(playerA.child.controller.current?.options).toContain(heroA); // Can target friendly hero
        expect(playerA.child.controller.current?.options).toContain(heroB); // Can target enemy hero
        playerA.child.controller.set(heroB); // Target Player B's hero for damage
        await promise;

        // Ironforge Rifleman should be on board
        expect(boardA.child.cards.length).toBe(1); // Ironforge Rifleman on board
        expect(handA.child.cards.length).toBe(0); // Ironforge Rifleman moved to board
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 = 7

        // Player B's hero should be damaged by 1
        expect(heroB.child.health.state.current).toBe(29); // 30 - 1 = 29
    });
});
