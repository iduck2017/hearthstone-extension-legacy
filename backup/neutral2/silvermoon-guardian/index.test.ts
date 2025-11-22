/**
 * Test cases for Silvermoon Guardian
 * 
 * Initial state: Player A has Silvermoon Guardian in hand.
 * Player B has a Wisp on board.
 * 
 * 1. silvermoon-guardian-play: Player A plays Silvermoon Guardian.
 * 2. wisp-attack: Player B's Wisp attacks Silvermoon Guardian, breaking the Divine Shield.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { SilvermoonGuardianModel } from "./index";
import { WispModel } from '../wisp';
import { boot } from '../../boot';

describe('silvermoon-guardian', () => {
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
                            cards: [new SilvermoonGuardianModel()]
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
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof SilvermoonGuardianModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const heroA = playerA.child.hero;

    test('silvermoon-guardian-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(3); // Silvermoon Guardian: 3/3
        expect(cardC.child.health.state.current).toBe(3);
        expect(handA.child.cards.length).toBe(1); // Silvermoon Guardian in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Silvermoon Guardian
        let promise = cardC.play();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Silvermoon Guardian should be on board
        expect(boardA.child.cards.length).toBe(1); // Silvermoon Guardian on board
        expect(handA.child.cards.length).toBe(0); // Silvermoon Guardian moved to board
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 = 6

        // Check that Silvermoon Guardian has Divine Shield
        expect(cardC.child.divineShield).toBeDefined(); // Has Divine Shield
    });

    test('wisp-attack', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(cardC.child.health.state.current).toBe(3); // Silvermoon Guardian: 3/3
        expect(cardD.child.health.state.current).toBe(1); // Wisp: 1/1
        expect(boardA.child.cards.length).toBe(1); // Silvermoon Guardian on board
        expect(boardB.child.cards.length).toBe(1); // Wisp on board

        // Player B's Wisp attacks Silvermoon Guardian - should break Divine Shield
        let promise = cardD.child.action.run();
        expect(playerB.controller.current?.options).toContain(cardC); // Can target Silvermoon Guardian
        expect(playerB.controller.current?.options).toContain(heroA); // Can target Player A's hero
        playerB.controller.set(cardC); // Target Silvermoon Guardian
        await promise;

        // Divine Shield should be broken, but Silvermoon Guardian takes no damage
        expect(cardC.child.health.state.current).toBe(3); // Silvermoon Guardian: 3/3 (no damage due to Divine Shield)
        expect(cardD.child.health.state.current).toBe(-2); // Wisp: 1 - 3 = -2 (dies)
        expect(boardB.child.cards.length).toBe(0); // Wisp dies
        // Divine Shield should be consumed
        expect(cardC.child.divineShield.state.actived).toBe(false); // Divine Shield broken
    });
});
