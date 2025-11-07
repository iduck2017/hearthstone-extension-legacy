/**
 * Test cases for Mirror Entity
 * 
 * 1. mirror-entity-cast: Player A plays Mirror Entity, then plays Wisp (should not trigger on own minions)
 * 2. water-elemental-play: Player B plays Water Elemental, triggers Mirror Entity, Player A summons a copy
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { MirrorEntityModel } from "./index";
import { WispModel } from "../wisp";
import { WaterElementalModel } from "../water-elemental";
import { boot } from "../boot";

describe('mirror-entity', () => {
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
                        child: {
                            cards: [new MirrorEntityModel(), new WispModel()]
                        }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: {
                            cards: [new WaterElementalModel()]
                        }
                    })
                }
            })
        }
    });
    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const handA = playerA.child.hand;
    const handB = playerB.child.hand;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const cardC = handA.child.cards.find(item => item instanceof MirrorEntityModel);
    const cardD = handA.child.cards.find(item => item instanceof WispModel);
    const cardE = handB.child.cards.find(item => item instanceof WaterElementalModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    test('mirror-entity-cast', async () => {
        // Check initial stats
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(2);
        expect(boardA.child.secrets.length).toBe(0);
        expect(boardA.child.cards.length).toBe(0);

        // Player A plays Mirror Entity
        await cardC.play();

        // Check secret is deployed
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 cost
        expect(handA.child.cards.length).toBe(1);
        expect(boardA.child.secrets.length).toBe(1);
        expect(boardA.child.cards.length).toBe(0);

        // Player A plays Wisp (should not trigger Mirror Entity on own minions)
        const promise = cardD.play();
        playerA.child.controller.set(0);
        await promise;

        // Check Wisp is deployed but Mirror Entity is not triggered
        expect(playerA.child.mana.state.current).toBe(7); // 7 - 1 cost
        expect(handA.child.cards.length).toBe(0);
        expect(boardA.child.cards.length).toBe(1);
        expect(boardA.child.secrets.length).toBe(1); // Secret still active
    });

    test('water-elemental-play', async () => {
        // Turn passes to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial stats
        expect(playerB.child.mana.state.current).toBe(10);
        expect(handB.child.cards.length).toBe(1);
        expect(boardB.child.cards.length).toBe(0);
        expect(boardA.child.secrets.length).toBe(1); // Mirror Entity still active

        // Player B plays Water Elemental (should trigger Mirror Entity)
        const promise = cardE.play();
        playerB.child.controller.set(0);
        await promise;

        // Check Water Elemental is deployed and Mirror Entity is triggered
        expect(playerB.child.mana.state.current).toBe(6); // 10 - 4 cost
        expect(handB.child.cards.length).toBe(0);
        expect(boardB.child.cards.length).toBe(1);

        // Check Mirror Entity triggered: Player A should have a copy of Water Elemental
        expect(boardA.child.secrets.length).toBe(0); // Secret consumed
        expect(boardA.child.cards.length).toBe(2); // Original Wisp + copied Water Elemental
        
        // Verify the copied Water Elemental has correct stats
        const cardG = boardA.child.cards.find(minion => minion instanceof WaterElementalModel);
        expect(cardG).toBeDefined();
    });
});
