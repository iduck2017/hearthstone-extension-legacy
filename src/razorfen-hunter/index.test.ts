/**
 * Test cases for Razorfen Hunter
 * 
 * Initial state: Player A has Razorfen Hunter in hand.
 * Player B has empty board.
 * 
 * 1. razorfen-hunter-play: Player A plays Razorfen Hunter, summoning a Boar.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { RazorfenHunterModel } from "./index";
import { BoarModel } from "../boar";
import { boot } from "../boot";

describe('razorfen-hunter', () => {
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
                            minions: [new RazorfenHunterModel()],
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
                            minions: [],
                            spells: []
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
    const cardC = handA.refer.queue?.find(item => item instanceof RazorfenHunterModel);
    if (!cardC) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;

    test('razorfen-hunter-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(2); // Razorfen Hunter: 2/3
        expect(roleC.child.health.state.current).toBe(3);
        expect(handA.refer.queue?.length).toBe(1); // Razorfen Hunter in hand
        expect(boardA.refer.queue?.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Razorfen Hunter
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Razorfen Hunter should be on board
        expect(boardA.refer.queue?.length).toBe(2); // Razorfen Hunter + Boar on board
        expect(handA.refer.queue?.length).toBe(0); // Razorfen Hunter moved to board
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 = 7

        // Check that a Boar was summoned
        const cardD = boardA.refer.queue?.find(item => item instanceof BoarModel);
        expect(cardD).toBeDefined(); // Boar was summoned
        expect(cardD?.child.role.child.attack.state.current).toBe(1); // Boar: 1/1
        expect(cardD?.child.role.child.health.state.current).toBe(1);

        expect(boardA.refer.order[0]).toBe(cardC);
        expect(boardA.refer.order[1]).toBe(cardD);
    });
});
