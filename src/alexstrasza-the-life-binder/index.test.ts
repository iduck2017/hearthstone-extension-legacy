/**
 * Test cases for Alexstrasza the Life-Binder
 * 
 * Initial state: Player A and Player B both have Alexstrasza the Life-Binder in hand.
 * 
 * 1. alexstrasza-the-life-binder-damage: Player A plays Alexstrasza and targets Player B's hero for damage.
 * 2. alexstrasza-the-life-binder-heal: Player B plays Alexstrasza and targets Player A's hero for healing.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, AnimeUtil } from "hearthstone-core";
import { AlexstraszaTheLifeBinderModel } from "./index";
import { boot } from "../boot";

describe('alexstrasza-the-life-binder', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
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
                            minions: [new AlexstraszaTheLifeBinderModel()],
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
                            minions: [new AlexstraszaTheLifeBinderModel()],
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
    const handA = playerA.child.hand;
    const handB = playerB.child.hand;
    const cardC = handA.refer.queue.find(item => item instanceof AlexstraszaTheLifeBinderModel);
    const cardD = handB.refer.queue.find(item => item instanceof AlexstraszaTheLifeBinderModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;

    test('alexstrasza-the-life-binder-damage', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(8); // Alexstrasza: 8/8
        expect(roleC.child.health.state.current).toBe(8);
        expect(roleB.child.health.state.current).toBe(30); // Player B hero: 30 health
        expect(handA.refer.queue.length).toBe(1); // Alexstrasza in hand
        expect(boardA.refer.queue.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Alexstrasza the Life-Binder
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await AnimeUtil.sleep();
        
        // Choose target for battlecry
        expect(SelectUtil.current?.options).toContain(roleA); // Can target friendly hero
        expect(SelectUtil.current?.options).toContain(roleB); // Can target enemy hero
        SelectUtil.set(roleB); // Target Player B's hero for damage
        await promise;

        // Alexstrasza should be on board
        expect(boardA.refer.queue.length).toBe(1); // Alexstrasza on board
        expect(handA.refer.queue.length).toBe(0); // Alexstrasza moved to board
        expect(playerA.child.mana.state.current).toBe(1); // 10 - 9 = 1

        // Player B's hero should take 8 damage (enemy target)
        expect(roleB.child.health.state.current).toBe(22); // 30 - 8 = 22
    });

    test('alexstrasza-the-life-binder-heal', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(roleA.child.health.state.current).toBe(30); // Player A hero: 30 health
        expect(handB.refer.queue.length).toBe(1); // Alexstrasza in hand
        expect(playerB.child.mana.state.current).toBe(10); // Full mana

        // Play Alexstrasza the Life-Binder
        let promise = cardD.play();
        SelectUtil.set(0); // Select position 0
        await AnimeUtil.sleep();
        
        // Choose target for battlecry
        expect(SelectUtil.current?.options).toContain(roleA); // Can target enemy hero
        expect(SelectUtil.current?.options).toContain(roleB); // Can target friendly hero
        SelectUtil.set(roleB); // Target Player B's hero for healing
        await promise;

        // Alexstrasza should be on board
        expect(playerB.child.board.refer.queue.length).toBe(1); // Alexstrasza on board
        expect(handB.refer.queue.length).toBe(0); // Alexstrasza moved to board
        expect(playerB.child.mana.state.current).toBe(1); // 10 - 9 = 1

        // Player B's hero should be healed by 8 (friendly target from Player B's perspective)
        expect(roleB.child.health.state.current).toBe(30); // Healed back to max health (22 + 8 = 30)
    });
});
