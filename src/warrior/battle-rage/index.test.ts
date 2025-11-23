/**
 * Test cases for Battle Rage
 * 
 * 1. initial-state:
 *    - Player A has Wisp (1/1) on board
 *    - Player A hero health 30
 *    - Player A has Battle Rage in hand
 *    - Player A deck has 2 cards
 *    - Player B has Mana Wyrm (1/3) on board
 *    - Player B hero health 30
 *    - Player B has Battle Rage in hand
 *    - Player B deck has 2 cards
 * 2. battle-rage-cast:
 *    - Player A uses Battle Rage
 *    - Assert: Player A's hand size is 0 (Battle Rage consumed, no damaged friendly characters, no cards drawn)
 * 3. wisp-attack:
 *    - Player A's Wisp attacks Player B's hero
 *    - Assert: Player B's hero health is 29
 * 4. hero-power-cast:
 *    - Player A uses hero power to damage Player B's Mana Wyrm
 *    - Assert: Player B's Mana Wyrm health is 2
 * 5. battle-rage-cast:
 *    - Switch to Player B's turn
 *    - Player B uses Battle Rage
 *    - Assert: Player B's hand size is 2 (Battle Rage consumed, hero and minion are damaged, 2 cards drawn)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil } from "hearthstone-core";
import { BattleRageModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { ManaWyrmModel } from "../../mage/mana-wyrm";
import { boot } from "../../boot";

describe('battle-rage', () => {
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
                            cards: [new BattleRageModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { cards: [new WispModel(), new WispModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new ManaWyrmModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new BattleRageModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { cards: [new WispModel(), new WispModel()] }
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
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;
    
    const cardC = boardA.child.cards.find(item => item instanceof WispModel);
    const cardD = handA.child.cards.find(item => item instanceof BattleRageModel);
    const cardE = boardB.child.cards.find(item => item instanceof ManaWyrmModel);
    const cardF = handB.child.cards.find(item => item instanceof BattleRageModel);
    if (!cardC || !cardD || !cardE || !cardF) throw new Error();

    // initial-state:
    // - Player A has Wisp (1/1) on board
    // - Player A hero health 30
    // - Player A has Battle Rage in hand
    // - Player A deck has 2 cards
    // - Player B has Mana Wyrm (1/3) on board
    // - Player B hero health 30
    // - Player B has Battle Rage in hand
    // - Player B deck has 2 cards

    test('battle-rage-cast', async () => {
        // Player A uses Battle Rage
        await cardD.play();

        // Assert: Player A's hand size is 0 (Battle Rage consumed, no damaged friendly characters, no cards drawn)
        expect(handA.child.cards.length).toBe(0);
    });

    test('wisp-attack', async () => {
        // Player A's Wisp attacks Player B's hero
        let promise = cardC.child.action.run();
        playerA.controller.set(heroB); // Target Player B's hero
        await promise;

        // Assert: Player B's hero health is 29
        expect(heroB.child.health.state.current).toBe(29);
    });

    test('hero-power-cast', async () => {
        // Player A uses hero power to damage Player B's Mana Wyrm
        // Mage hero power: Fireblast - Deal 1 damage
        const skill = heroA.child.skill;
        let promise = skill.use();
        const selector = playerA.controller.current;
        expect(selector?.options).toContain(cardE);
        playerA.controller.set(cardE);
        await promise;

        // Assert: Player B's Mana Wyrm health is 2
        expect(cardE.child.health.state.current).toBe(2);
    });

    test('battle-rage-cast', async () => {
        // Switch to Player B's turn
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Player B uses Battle Rage
        await cardF.play();

        // Assert: Player B's hand size is 2 (Battle Rage consumed, hero and minion are damaged, 2 cards drawn)
        expect(handB.child.cards.length).toBe(2);
    });
});

