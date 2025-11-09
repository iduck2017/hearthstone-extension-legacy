/**
 * Test cases for Ice Barrier
 * 
 * 1. wisp-attack: Player A uses Wisp to attack Player B, Player B takes damage and becomes 29 health
 * 2. ice-barrier-cast: Player B plays Ice Barrier, Player A attacks again with Wisp, Player B gains 8 armor and takes damage to 7
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { IceBarrierModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('ice-barrier', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new WispModel()] }
                    }),
                    deck: new DeckModel({
                        child: {
                            cards: []
                        }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    hand: new HandModel({
                        child: { cards: [new IceBarrierModel()] }
                    }),
                }
            })
        }
    });
    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const handB = playerB.child.hand;
    const cardC = boardA.child.cards.find(item => item instanceof WispModel);
    const cardD = handB.child.cards.find(item => item instanceof IceBarrierModel);
    if (!cardC || !cardD) throw new Error();
    const heroB = playerB.child.hero;

    test('wisp-attack', async () => {
        // Check initial stats
        expect(heroB.child.health.state.current).toBe(30); // Player B initial health
        expect(cardC.child.health.state.current).toBe(1); // Wisp health
        expect(cardC.child.attack.state.current).toBe(1); // Wisp attack

        // Player A's Wisp attacks Player B's hero
        const promise = cardC.child.action.run();
        expect(playerA.child.controller.current?.options).toContain(heroB);
        playerA.child.controller.set(heroB);
        await promise;

        // Player B should take 1 damage
        expect(heroB.child.health.state.current).toBe(29); // 30 - 1 = 29
    })

    test('ice-barrier-cast', async () => {
        // Turn passes to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Player B plays Ice Barrier
        expect(boardB.child.secrets.length).toBe(0);
        expect(handB.child.cards.length).toBe(1);
        await cardD.play();
        expect(boardB.child.secrets.length).toBe(1);
        expect(handB.child.cards.length).toBe(0);

        // Turn passes to Player A
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerA);

        // Player A's Wisp attacks Player B's hero again
        const promise = cardC.child.action.run();
        expect(playerA.child.controller.current?.options).toContain(heroB);
        playerA.child.controller.set(heroB);
        await promise;

        // Player B should gain 8 armor (health increases by 8) and then take 1 damage
        expect(heroB.child.health.state.current).toBe(29); 
        expect(heroB.child.armor.state.current).toBe(7);
        expect(boardB.child.secrets.length).toBe(0);
    })
})
