/**
 * Test cases for Sunwalker
 * 
 * Initial state: Player A has Sunwalker in hand.
 * Player B has a Wisp on board.
 * 
 * 1. sunwalker-play: Player A plays Sunwalker.
 * 2. wisp-attack: Player B's Wisp cannot attack Player A's hero due to Sunwalker's Taunt.
 * 3. divine-shield-test: Sunwalker's Divine Shield blocks damage.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { SunwalkerModel } from "./index";
import { WispModel } from '../../neutral/wisp';
import { boot } from '../../boot';

describe('sunwalker', () => {
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
                            cards: [new SunwalkerModel()]
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
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof SunwalkerModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const heroA = playerA.child.hero;

    test('sunwalker-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(4); // Sunwalker: 4/5
        expect(cardC.child.health.state.current).toBe(5);
        expect(handA.child.cards.length).toBe(1); // Sunwalker in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Sunwalker
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Sunwalker should be on board
        expect(boardA.child.cards.length).toBe(1); // Sunwalker on board
        expect(handA.child.cards.length).toBe(0); // Sunwalker moved to board
        expect(playerA.child.mana.state.current).toBe(4); // 10 - 6 = 4

        // Check that Sunwalker has Taunt and Divine Shield
        expect(cardC.child.taunt.state.actived).toBe(true); // Has Taunt
        expect(cardC.child.divineShield.state.actived).toBe(true); // Has Divine Shield
    });

    test('wisp-attack', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check that Wisp cannot attack hero due to Sunwalker's Taunt
        expect(boardA.child.cards.length).toBe(1); // Sunwalker on board
        expect(boardB.child.cards.length).toBe(1); // Wisp on board
        expect(cardD.child.attack.state.current).toBe(1); // Wisp: 1/1
        expect(cardD.child.health.state.current).toBe(1);

        // Try to attack with Wisp
        const promise = cardD.child.action.start();
        expect(playerB.child.controller.current?.options).not.toContain(heroA); // Cannot target enemy hero
        expect(playerB.child.controller.current?.options).toContain(cardC); // Must target Sunwalker due to Taunt
        playerB.child.controller.set(cardC); // Target Sunwalker
        await promise;

        // Sunwalker should take 1 damage but Divine Shield should block it
        expect(cardC.child.health.state.current).toBe(5); // Still 5 health (Divine Shield blocked damage)
        expect(cardC.child.divineShield.state.actived).toBe(false); // Divine Shield consumed
    });
});
