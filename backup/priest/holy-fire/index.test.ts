/**
 * Test cases for Holy Fire
 * 
 * Initial state: Player A has Water Elemental on board.
 * Player B has Holy Fire in hand.
 * 
 * 1. water-element-attack: Water Elemental attacks Player B's hero.
 * 2. holy-fire-cast: Player B casts Holy Fire, dealing 5 damage to a target and restoring 5 Health to Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { HolyFireModel } from "./index";
import { WaterElementalModel } from "../../mage/water-elemental";
import { boot } from "../../boot";

describe('holy-fire', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new WaterElementalModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: []
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
                            cards: [new HolyFireModel()]
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
    const handB = playerB.child.hand;
    const cardC = boardA.child.cards.find(item => item instanceof WaterElementalModel);
    const cardD = handB.child.cards.find(item => item instanceof HolyFireModel);
    if (!cardC || !cardD) throw new Error();
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;

    test('water-element-attack', async () => {
        // Check initial state
        expect(heroA.child.health.state.current).toBe(30); // Player A hero: 30 health
        expect(heroB.child.health.state.current).toBe(30); // Player B hero: 30 health
        expect(cardC.child.attack.state.current).toBe(3); // Water Elemental: 3/6
        expect(cardC.child.health.state.current).toBe(6);
        expect(boardA.child.cards.length).toBe(1); // Water Elemental on board

        // Water Elemental attacks Player B's hero
        const promise = cardC.child.action.run();
        expect(playerA.child.controller.current?.options).toContain(heroB);
        playerA.child.controller.set(heroB);
        await promise;

        // Player B's hero should be damaged and frozen
        expect(heroB.child.health.state.current).toBe(27); // 30 - 3 = 27
        expect(heroB.child.feats.child.frozen.state.isActive).toBe(true); // Frozen by Water Elemental
    });

    test('holy-fire-cast', async () => {
        // Turn to Player B
        game.child.turn.next();
        
        // Check initial state
        expect(heroA.child.health.state.current).toBe(30); // Player A hero: 30 health
        expect(heroB.child.health.state.current).toBe(27); // Player B hero: 27 health (damaged)
        expect(cardC.child.attack.state.current).toBe(3); // Water Elemental: 3/6
        expect(cardC.child.health.state.current).toBe(6);
        expect(handB.child.cards.length).toBe(1); // Holy Fire in hand
        expect(playerB.child.mana.state.current).toBe(10); // Full mana

        // Cast Holy Fire targeting Water Elemental
        const promise = cardD.play();
        expect(playerB.child.controller.current?.options).toContain(heroA); // Can target enemy hero
        expect(playerB.child.controller.current?.options).toContain(heroB); // Can target friendly hero
        expect(playerB.child.controller.current?.options).toContain(cardC); // Can target enemy minion
        playerB.child.controller.set(cardC); // Target Water Elemental
        await promise;

        // Water Elemental should survive (6 health - 5 damage = 1 health)
        expect(boardA.child.cards.length).toBe(1); // Water Elemental still on board
        expect(cardC.child.health.state.current).toBe(1); // 6 - 5 = 1

        // Player B's hero should be healed by 5 (27 + 5 = 32, but max is 30)
        expect(heroB.child.health.state.current).toBe(30); // Healed to max health

        // Holy Fire should be consumed
        expect(handB.child.cards.length).toBe(0); // Holy Fire consumed
        expect(playerB.child.mana.state.current).toBe(4); // 10 - 6 = 4
    });
});
