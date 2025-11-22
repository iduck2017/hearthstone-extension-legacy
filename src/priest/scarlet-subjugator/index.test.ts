/**
 * Test cases for Scarlet Subjugator
 * 
 * Initial state: Player A has Scarlet Subjugator in hand.
 * Player B has Water Elemental (3/6) on board.
 * 
 * 1. scarlet-subjugator-play: Player A plays Scarlet Subjugator, gives Water Elemental -2 Attack.
 * 2. water-element-attack: Player B uses Water Elemental to attack Player A's hero.
 * 3. turn-start: Player A's turn starts, Water Elemental's debuff expires.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, CommonUtil, WarriorModel } from "hearthstone-core";
import { ScarletSubjugatorModel } from "./index";
import { WaterElementalModel } from "../../mage/water-elemental";
import { boot } from "../../boot";

describe('scarlet-subjugator', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new WarriorModel(),
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new ScarletSubjugatorModel()]
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
                            cards: [new WaterElementalModel()]
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
    const cardC = handA.child.cards.find(item => item instanceof ScarletSubjugatorModel);
    const cardD = boardB.child.cards.find(item => item instanceof WaterElementalModel);
    if (!cardC || !cardD) throw new Error();

    test('scarlet-subjugator-play', async () => {
        // Check initial state
        expect(cardD.child.attack.state.current).toBe(3); // Water Elemental: 3/6
        expect(playerA.child.mana.state.current).toBe(10);
        expect(boardA.child.cards.length).toBe(0);
        expect(handA.child.cards.length).toBe(1);

        // Player A plays Scarlet Subjugator
        const promise = cardC.play();
        playerA.controller.set(0);
        await CommonUtil.sleep();
        expect(playerA.controller.current?.options).toContain(cardD); // Water Elemental should be targetable
        playerA.controller.set(cardD);
        await promise;

        // Check that Scarlet Subjugator is on board
        expect(boardA.child.cards.length).toBe(1);

        expect(cardC.child.attack.state.current).toBe(2); // Scarlet Subjugator: 2/1
        expect(cardC.child.health.state.current).toBe(1);

        // Water Elemental should have -2 Attack
        expect(cardD.child.attack.state.current).toBe(1); // 3 - 2 = 1
        expect(cardD.child.health.state.current).toBe(6); // Health unchanged
      
        // Scarlet Subjugator should be consumed
        expect(handA.child.cards.length).toBe(0); // Scarlet Subjugator consumed
        expect(playerA.child.mana.state.current).toBe(9); // 10 - 1 cost
    });

    test('water-element-attack', async () => {
        const turn = game.child.turn;
        turn.next();

        // Water Elemental attacks Player A's hero with reduced attack
        const heroA = playerA.child.hero;
        
        // Check that Water Elemental still has -2 Attack
        expect(cardD.child.attack.state.current).toBe(1); // 3 - 2 = 1
        expect(cardD.child.health.state.current).toBe(6); // Health unchanged
        
        // Water Elemental attacks hero
        const promise = cardD.child.action.run();
        playerB.controller.set(heroA);
        await promise;
        
        // Hero should take 1 damage (reduced attack)
        expect(heroA.child.health.state.current).toBe(29); // 30 - 1 = 29
    });

    test('turn-start', async () => {
        // Player A's turn starts, Water Elemental's debuff should expire
        game.child.turn.next();
        // Water Elemental should regain full attack
        expect(cardD.child.attack.state.current).toBe(3); // Back to original 3 attack
        expect(cardD.child.health.state.current).toBe(6); // Health unchanged
    });
});
