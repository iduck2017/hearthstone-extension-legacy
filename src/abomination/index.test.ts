/**
 * Test cases for Abomination
 * 
 * Initial state: Player A has Abomination on board.
 * Player B has a Stranglethorn Tiger on board.
 * 
 * 1. abomination-play: Player A plays Abomination.
 * 2. abomination-death: Player B's Stranglethorn Tiger attacks Abomination, triggering deathrattle.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { AbominationModel } from "./index";
import { StranglethornTigerModel } from "../stranglethorn-tiger";
import { boot } from "../boot";

describe('abomination', () => {
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
                            minions: [new AbominationModel()],
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
                            minions: [new StranglethornTigerModel()]
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
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    const cardC = handA.refer.queue?.find(item => item instanceof AbominationModel);
    const cardD = boardB.refer.queue?.find(item => item instanceof StranglethornTigerModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('abomination-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(4); // Abomination: 4/4
        expect(roleC.child.health.state.current).toBe(4);
        expect(handA.refer.queue?.length).toBe(1); // Abomination in hand
        expect(boardA.refer.queue?.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Abomination
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await promise;

        // Abomination should be on board
        expect(boardA.refer.queue?.length).toBe(1); // Abomination on board
        expect(handA.refer.queue?.length).toBe(0); // Abomination moved to board
        expect(playerA.child.mana.state.current).toBe(4); // 10 - 6 = 4

        // Check that Abomination has Taunt
        expect(cardC.child.role.child.feats.child.taunt).toBeDefined(); // Has Taunt
    });

    test('abomination-death', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(roleC.child.health.state.current).toBe(4); // Abomination: 4/4
        expect(roleD.child.health.state.current).toBe(5); // Stranglethorn Tiger: 5/5
        expect(roleA.child.health.state.current).toBe(30); // Player A hero: 30 health
        expect(roleB.child.health.state.current).toBe(30); // Player B hero: 30 health
        expect(boardA.refer.queue?.length).toBe(1); // Abomination on board
        expect(boardB.refer.queue?.length).toBe(1); // Stranglethorn Tiger on board

        // Player B's Stranglethorn Tiger attacks Abomination
        let promise = roleD.child.action.run();
        expect(SelectUtil.current?.options).toContain(roleC); // Can target Abomination (Taunt forces this)
        expect(SelectUtil.current?.options).not.toContain(roleA); // Cannot target Player A's hero (Taunt blocks)
        SelectUtil.set(roleC); // Target Abomination
        await promise;

        expect(roleD.child.health.state.current).toBe(-1);
        expect(roleC.child.health.state.current).toBe(-1);
        expect(cardD.child.dispose.status).toBe(true);
        expect(cardC.child.dispose.status).toBe(true);

        // Both minions should die (5/5 vs 4/4)
        expect(boardA.refer.queue?.length).toBe(0); // Abomination dies
        expect(boardB.refer.queue?.length).toBe(0); // Stranglethorn Tiger dies

        // Deathrattle should deal 2 damage to both heroes
        expect(roleA.child.health.state.current).toBe(28); // Player A hero: 30 - 2 = 28
        expect(roleB.child.health.state.current).toBe(28); // Player B hero: 30 - 2 = 28
    });
});
