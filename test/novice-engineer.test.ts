/*
Test scenario for Novice Engineer:

Initial: Player A has Novice Engineer in hand and wisp in deck
1. Player A plays Novice Engineer, draws a card
*/

import { GameModel, HandModel, DeckModel, MageModel, TimeUtil, SelectUtil } from "hearthstone-core";
import { NoviceEngineerModel } from "../src/novice-engineer";
import { WispModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('novice-engineer', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    hand: new HandModel({
                        child: { cards: [new NoviceEngineerModel({})] }
                    }),
                    deck: new DeckModel({
                        child: { cards: [new WispModel({})] }
                    }),
                }
            }),
            playerB: new MageModel({})
        }
    }));
    const handA = game.child.playerA.child.hand;
    const deckA = game.child.playerA.child.deck;
    const boardA = game.child.playerA.child.board;
    const cardA = handA.child.cards.find(item => item instanceof NoviceEngineerModel);

    test('novice-engineer-battlecry', async () => {
        // Check initial state
        expect(handA.child.cards.length).toBe(1);
        expect(deckA.child.cards.length).toBe(1);
        expect(boardA.child.cards.length).toBe(0);
        
        // Play Novice Engineer
        const promise = cardA?.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options.length).toBe(1);
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        
        // Check final state - should draw a card from battlecry
        expect(handA.child.cards.length).toBe(1); // Drew wisp from deck
        expect(deckA.child.cards.length).toBe(0); // Deck is now empty
        expect(boardA.child.cards.length).toBe(1); // Novice Engineer is on board
    })
}) 