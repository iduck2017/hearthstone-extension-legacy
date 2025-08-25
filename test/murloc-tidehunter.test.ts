// Test scenario:
// Initial setup: Player A has Wisp on board, plays Murloc Tidehunter
// Test case: Player A plays Murloc Tidehunter, places it to the left of Wisp, board should have three minions from left to right: Tidehunter, Scout, Wisp

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil, ManaModel } from "hearthstone-core";
import { MurlocTidehunterModel } from "../src/murloc-tidehunter";
import { MurlocScoutModel } from "../src/murloc-scout";
import { WispModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('murloc-tidehunter', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    board: new BoardModel({
                        child: { cards: [new WispModel({})] }
                    }),
                    hand: new HandModel({
                        child: { cards: [new MurlocTidehunterModel({})] }
                    })
                }
            }),
            playerB: new MageModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
                    })
                }
            })
        }
    }));
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const handB = game.child.playerB.child.hand;
    const cardA = handA.child.cards.find(item => item instanceof MurlocTidehunterModel);
    const roleA = cardA?.child.minion;
    if (!roleA) throw new Error();

    test('murloc-tidehunter-battlecry', async () => {
        
        expect(boardA.child.cards.length).toBe(1);
        expect(boardA.child.cards[0] instanceof WispModel).toBe(true);
        
        // Play Murloc Tidehunter to the left of Wisp
        let promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;

        expect(boardA.child.cards.length).toBe(3);
        expect(boardA.child.cards[0] instanceof MurlocTidehunterModel).toBe(true);
        expect(boardA.child.cards[1] instanceof MurlocScoutModel).toBe(true);
        expect(boardA.child.cards[2] instanceof WispModel).toBe(true);
    })
}) 