/*
Test scenario for Loot Hoarder:

Initial: Player A has Loot Hoarder on board and wisp in deck, Player B has wisp on board
1. Player A's Loot Hoarder attacks Player B's wisp, both die, Player A draws a card
*/

import { GameModel, BoardModel, HandModel, DeckModel, MageModel, PlayerModel, TimeUtil, SelectUtil, DeathStatus } from "hearthstone-core";
import { LootHoarderModel } from "../src/loot-hoarder";
import { WispModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('loot-hoarder', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [new LootHoarderModel({})] }
                    }),
                    deck: new DeckModel({
                        child: { cards: [new WispModel({})] }
                    }),
                }
            }),
            playerB: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [new WispModel({})] }
                    }),
                }
            })
        }
    }));
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const deckA = game.child.playerA.child.deck;
    const cardA = boardA.child.cards.find(item => item instanceof LootHoarderModel);
    const cardB = boardB.child.cards.find(item => item instanceof WispModel);
    const roleA = cardA?.child.minion;
    const roleB = cardB?.child.minion;
    if (!roleA || !roleB) throw new Error();

    test('loot-hoarder-deathrattle', async () => {
        // Check initial state
        expect(boardA.child.cards.length).toBe(1);
        expect(boardB.child.cards.length).toBe(1);
        expect(handA.child.cards.length).toBe(0);
        expect(deckA.child.cards.length).toBe(1);
        expect(roleA.state.attack).toBe(2);
        expect(roleA.state.health).toBe(1);
        expect(roleB.state.attack).toBe(1);
        expect(roleB.state.health).toBe(1);

        // Loot Hoarder attacks wisp
        let promise = roleA.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options.length).toBe(2);
        SelectUtil.set(roleB);
        await promise;
        
        // Check final state - both minions should die and player A should draw a card
        expect(boardA.child.cards.length).toBe(0);
        expect(boardB.child.cards.length).toBe(0);
        expect(roleA.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(roleB.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(handA.child.cards.length).toBe(1); // Drew a card from deathrattle
        expect(deckA.child.cards.length).toBe(0); // Deck is now empty
    })
}) 