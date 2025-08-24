// Test scenarios for Bloodmage Thalnos:
// Initial: Player A has Bloodmage Thalnos on board and wisp in deck, Player B has wisp on board
// 1. Player A uses Bloodmage Thalnos to attack wisp, both die, Player A triggers deathrattle and draws wisp

import { GameModel, BoardModel, DeckModel, MageModel, TimeUtil, SelectUtil, DeathStatus } from "hearthstone-core";
import { BloodmageThalnosModel } from "../src/bloodmage-thalnos";
import { WispModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('bloodmage-thalnos', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [new BloodmageThalnosModel({})] }
                    }),
                    deck: new DeckModel({
                        child: { cards: [new WispModel({})] }
                    })
                }
            }),
            playerB: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [new WispModel({})] }
                    })
                }
            })
        }
    }));
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const deckA = game.child.playerA.child.deck;
    const handA = game.child.playerA.child.hand;
    const cardA = boardA.child.cards.find(item => item instanceof BloodmageThalnosModel);
    const cardB = boardB.child.cards.find(item => item instanceof WispModel);
    const roleA = cardA?.child.minion;
    const roleB = cardB?.child.minion;
    if (!roleA || !roleB) throw new Error();

    test('bloodmage-thalnos-attack', async () => {
        // Verify initial state
        expect(boardA.child.cards.length).toBe(1);
        expect(boardB.child.cards.length).toBe(1);
        expect(deckA.child.cards.length).toBe(1);
        expect(handA.child.cards.length).toBe(0);
        expect(roleA.state.attack).toBe(1);
        expect(roleA.state.health).toBe(1);
        expect(roleB.state.attack).toBe(1);
        expect(roleB.state.health).toBe(1);
        
        // Player A uses Bloodmage Thalnos to attack wisp
        let promise = roleA.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleB);
        SelectUtil.set(roleB);
        await promise;
        
        // Verify both minions die
        expect(roleA.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(roleB.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(boardA.child.cards.length).toBe(0);
        expect(boardB.child.cards.length).toBe(0);
        
        // Verify deathrattle triggers and draws a card
        expect(deckA.child.cards.length).toBe(0);
        expect(handA.child.cards.length).toBe(1);
    });
}); 