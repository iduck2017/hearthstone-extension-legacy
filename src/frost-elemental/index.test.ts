/**
 * Test cases for Frost Elemental
 * 
 * Initial state: Player A has Frost Elemental in hand.
 * Player B has a minion on board.
 * 
 * 1. frost-elemental-play: Player A plays Frost Elemental, freezing a target.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { FrostElementalModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('frost-elemental', () => {
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
                            minions: [new FrostElementalModel()],
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
                            minions: [new WispModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { spells: [] }
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
    const cardC = handA.child.minions.find(item => item instanceof FrostElementalModel);
    const cardD = boardB.child.minions.find(item => item instanceof WispModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('frost-elemental-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(5); // Frost Elemental: 5/5
        expect(roleC.child.health.state.current).toBe(5);
        expect(roleD.child.attack.state.current).toBe(1); // Wisp: 1/1
        expect(roleD.child.health.state.current).toBe(1);
        expect(handA.child.minions.length).toBe(1); // Frost Elemental in hand
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Frost Elemental
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await AnimeUtil.sleep();
        expect(playerA.child.controller.current?.options).toContain(roleA); // Can target friendly hero
        expect(playerA.child.controller.current?.options).toContain(roleB); // Can target enemy hero
        expect(playerA.child.controller.current?.options).toContain(roleD); // Can target enemy minion
        playerA.child.controller.set(roleD); // Target Wisp
        await promise;

        // Wisp should be frozen
        expect(roleD.child.feats.child.frozen.state.isActive).toBe(true);

        // Frost Elemental should be on board
        expect(boardA.child.minions.length).toBe(1); // Frost Elemental on board
        expect(handA.child.minions.length).toBe(0); // Frost Elemental moved to board
        expect(playerA.child.mana.state.current).toBe(4); // 10 - 6 = 4
    });
});
