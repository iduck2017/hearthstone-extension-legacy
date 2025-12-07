/**
 * Test cases for Blood Imp
 * 
 * 1. initial-state:
 *    - Player A has Blood Imp and Wisp in hand
 *    - Player A has no minions on board
 *    - Player B has Blood Imp in hand
 *    - Player B has Chillwind Yeti (4/5) on board
 * 2. blood-imp-play:
 *    - Player A plays Blood Imp
 *    - Assert: Blood Imp is on board (0/1 with Stealth)
 *    - Player A's turn ends
 *    - Assert: Blood Imp health is still 1 (no other friendly minions, effect does not trigger)
 * 3. chillwind-yeti-attack:
 *    - Player B's Chillwind Yeti attacks
 *    - Assert: Cannot target Blood Imp (Stealth prevents targeting)
 *    - Assert: Can only target Player A's hero
 * 4. wisp-summon:
 *    - Player A plays Wisp (1/1)
 *    - Assert: Board has 2 minions (Blood Imp and Wisp)
 *    - Player A's turn ends
 *    - Assert: Wisp health is 2 (gained +1 Health from Blood Imp)
 *    - Assert: Blood Imp health is still 1 (does not buff itself)
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { BloodImpModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { ChillwindYetiModel } from "../../neutral/chillwind-yeti";
import { boot } from "../../boot";

describe('blood-imp', () => {
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
                            cards: [new BloodImpModel(), new WispModel()]
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
                            cards: [new ChillwindYetiModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { cards: [new BloodImpModel()] }
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
    const turn = game.child.turn;
    
    const cardC = handA.child.cards.find(item => item instanceof BloodImpModel);
    const cardD = boardB.child.cards.find(item => item instanceof ChillwindYetiModel);
    const cardE = handA.child.cards.find(item => item instanceof WispModel);
    // let cardF = boardA.child.cards.find(item => item instanceof BloodImpModel);
    const cardF = handB.child.cards.find(item => item instanceof BloodImpModel);
    if (!cardC || !cardD || !cardE || !cardF) throw new Error();
    
    // initial-state: Player A has Blood Imp in hand, Player B has Blood Imp in hand and Chillwind Yeti on board

    test('blood-imp-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(0); // Blood Imp: 0/1
        expect(cardC.child.health.state.current).toBe(1);
        expect(handA.child.cards.length).toBe(2); // Blood Imp and Wisp in hand (Wisp drawn at turn start)
        expect(boardA.child.cards.length).toBe(0); // No minions on board

        // Player A plays Blood Imp
        let promise = cardC.play();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Assert: Blood Imp is on board (0/1 with Stealth)
        expect(boardA.child.cards.length).toBe(1); // Blood Imp on board
        expect(handA.child.cards.length).toBe(1); // Wisp still in hand (Blood Imp moved to board)
        expect(cardC.child.attack.state.current).toBe(0);
        expect(cardC.child.health.state.current).toBe(1);
        expect(cardC.child.stealth.state.isEnabled).toBe(true);

        // Player A's turn ends
        turn.next();

        // Assert: Blood Imp health is still 1 (no other friendly minions, effect does not trigger)
        expect(cardC.child.health.state.current).toBe(1);
    });

    test('chillwind-yeti-attack', async () => {
        const heroA = playerA.child.hero;
        
        // Turn to Player B
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(cardD.child.attack.state.current).toBe(4); // Yeti: 4/5
        expect(cardD.child.health.state.current).toBe(5);
        expect(cardC.child.health.state.current).toBe(1); // Blood Imp: 0/1
        expect(heroA.child.health.state.current).toBe(30); // Player A hero: 30 health

        // Player B's Chillwind Yeti attacks
        let promise = cardD.child.action.run();
        const selector = playerB.controller.current;
        // Assert: Cannot target Blood Imp (Stealth prevents targeting)
        expect(selector?.options).not.toContain(cardC);
        // Assert: Can only target Player A's hero
        expect(selector?.options).toContain(heroA);
        playerB.controller.set(heroA); // Target Player A's hero
        await promise;

        // Player A's hero should take 4 damage
        expect(heroA.child.health.state.current).toBe(26); // 30 - 4 = 26

        turn.next();
        expect(cardD.child.health.state.current).toBe(5); // Chillwind Yeti: 4/5
    });

    test('wisp-summon', async () => {
        
        // Player A plays Wisp (1/1)
        let promise = cardE.play();
        playerA.controller.set(0); // Select position 0
        await promise;

        // Assert: Board has 2 minions (Blood Imp and Wisp)
        expect(boardA.child.cards.length).toBe(2);
        expect(cardE.child.health.state.current).toBe(1); // Wisp: 1/1

        // Player A's turn ends
        turn.next();

        // Assert: Wisp health is 2 (gained +1 Health from Blood Imp)
        expect(cardE.child.health.state.current).toBe(2);
        // Assert: Blood Imp health is still 1 (does not buff itself)
        expect(cardC.child.health.state.current).toBe(1);
    });
});

