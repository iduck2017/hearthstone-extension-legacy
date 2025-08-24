// Test scenario:
// Initial setup: Player A has Stonetusk Boar in hand, Player B has Wisp on board
// Test case: Player A plays Stonetusk Boar, boar directly attacks Player B's hero

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil } from "hearthstone-core";
import { StonetuskBoarModel } from "../src/stonetusk-boar";
import { WispModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('stonetusk-boar', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { cards: [new StonetuskBoarModel({})] }
                    })
                }
            }),
            playerB: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [new WispModel({})] }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
                    })
                }
            })
        }
    }));
    const turn = game.child.turn;   
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const cardA = handA.child.cards.find(item => item instanceof StonetuskBoarModel);
    const cardB = boardB.child.cards.find(item => item instanceof WispModel);
    const roleA = cardA?.child.minion;
    const roleB = cardB?.child.minion;
    const roleC = game.child.playerB.child.role;
    if (!roleA || !roleB) throw new Error();

    test('stonetusk-boar-charge', async () => {
        expect(boardA.child.cards.length).toBe(0);
        expect(boardB.child.cards.length).toBe(1);
        expect(roleC.state.health).toBe(30);
        
        // Play Stonetusk Boar
        let promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        expect(boardA.child.cards.length).toBe(1);
        expect(roleA.state.attack).toBe(1);
        expect(roleA.state.health).toBe(1);
        expect(roleA.state.action).toBe(1);
        expect(roleA.child.action.check()).toBe(true);
        
        // Boar directly attacks enemy hero
        promise = roleA.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleC);
        expect(SelectUtil.current?.options.length).toBe(2);
        SelectUtil.set(roleC);
        await promise;
        
        expect(roleA.state.action).toBe(0);
        expect(roleC.state.health).toBe(29);
        expect(roleC.child.health.state.damage).toBe(1);
    })
}) 