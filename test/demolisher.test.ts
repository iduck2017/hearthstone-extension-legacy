/*
Test scenario for Demolisher:

Initial: Player A has empty board, Player B has Demolisher on board
1. Turn ends, Demolisher triggers, Player A health becomes 28, damage 2
*/

import { GameModel, BoardModel, HandModel, MageModel, TimeUtil, SelectUtil, ManaModel } from "hearthstone-core";
import { DemolisherModel } from "../src/demolisher";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('demolisher', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
                    }),
                }
            }),
            playerB: new MageModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    board: new BoardModel({
                        child: { cards: [new DemolisherModel({})] }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
                    }),
                }
            })
        }
    }));
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const cardA = boardB.child.cards.find(item => item instanceof DemolisherModel);
    const roleA = game.child.playerA.child.role;
    const roleB = cardA?.child.minion;
    if (!roleB) throw new Error();

    test('demolisher-start-turn', async () => {
        // Check initial state
        expect(boardA.child.cards.length).toBe(0);
        expect(boardB.child.cards.length).toBe(1);
        expect(roleA.state.health).toBe(30);
        
        // End turn to trigger Demolisher's start turn effect
        game.child.turn.next();
        await TimeUtil.sleep();
        
        // Check that Player A's health is reduced by 2
        expect(roleA.state.health).toBe(28);
        expect(roleA.child.health.state.damage).toBe(2);
    })
}) 