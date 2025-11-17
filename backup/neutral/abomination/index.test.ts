/**
 * Test cases for Abomination
 * 
 * Initial state: Player A has Abomination on board.
 * Player B has a Stranglethorn Tiger on board.
 * 
 * 1. abomination-play: Player A plays Abomination.
 * 2. abomination-death: Player B's Stranglethorn Tiger attacks Abomination, triggering deathrattle.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { AbominationModel } from "./index";
import { StranglethornTigerModel } from "../stranglethorn-tiger";
import { boot } from '../../boot';

describe('abomination', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { cards: [new AbominationModel()]}
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
                        child: { cards: [new StranglethornTigerModel()]}
                    }),
                    hand: new HandModel({
                        child: { cards: []}
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
    const cardC = handA.child.cards.find(item => item instanceof AbominationModel);
    const cardD = boardB.child.cards.find(item => item instanceof StranglethornTigerModel);
    if (!cardC || !cardD) throw new Error();
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;

    test('abomination-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(4); // Abomination: 4/4
        expect(cardC.child.health.state.current).toBe(4);
        expect(handA.child.cards.length).toBe(1); // Abomination in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Abomination
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Abomination should be on board
        expect(boardA.child.cards.length).toBe(1); // Abomination on board
        expect(handA.child.cards.length).toBe(0); // Abomination moved to board
        expect(playerA.child.mana.state.current).toBe(4); // 10 - 6 = 4

        // Check that Abomination has Taunt
        expect(cardC.child.feats.child.taunt).toBeDefined(); // Has Taunt
    });

    test('abomination-death', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(cardC.child.health.state.current).toBe(4); // Abomination: 4/4
        expect(cardD.child.health.state.current).toBe(5); // Stranglethorn Tiger: 5/5
        expect(heroA.child.health.state.current).toBe(30); // Player A hero: 30 health
        expect(heroB.child.health.state.current).toBe(30); // Player B hero: 30 health
        expect(boardA.child.cards.length).toBe(1); // Abomination on board
        expect(boardB.child.cards.length).toBe(1); // Stranglethorn Tiger on board

        // Player B's Stranglethorn Tiger attacks Abomination
        let promise = cardD.child.action.run();
        expect(playerB.child.controller.current?.options).toContain(cardC); // Can target Abomination (Taunt forces this)
        expect(playerB.child.controller.current?.options).not.toContain(heroA); // Cannot target Player A's hero (Taunt blocks)
        playerB.child.controller.set(cardC); // Target Abomination
        await promise;

        expect(cardD.child.health.state.current).toBe(-1);
        expect(cardC.child.health.state.current).toBe(-1);
        expect(cardD.child.dispose.status).toBe(true);
        expect(cardC.child.dispose.status).toBe(true);

        // Both minions should die (5/5 vs 4/4)
        expect(boardA.child.cards.length).toBe(0); // Abomination dies
        expect(boardB.child.cards.length).toBe(0); // Stranglethorn Tiger dies

        // Deathrattle should deal 2 damage to both heroes
        expect(heroA.child.health.state.current).toBe(28); // Player A hero: 30 - 2 = 28
        expect(heroB.child.health.state.current).toBe(28); // Player B hero: 30 - 2 = 28
    });
});
