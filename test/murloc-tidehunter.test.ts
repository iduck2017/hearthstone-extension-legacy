// Test scenario:
// Initial setup: Player A has Wisp on board, plays Murloc Tidehunter
// Test case: Player A plays Murloc Tidehunter, places it to the left of Wisp, board should have three minions from left to right: Tidehunter, Scout, Wisp

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil } from "hearthstone-core";
import { MurlocTidehunterModel } from "../src/murloc-tidehunter";
import { MurlocScoutModel } from "../src/murloc-scout";
import { WispModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('murloc-tidehunter', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new WispModel({})] }
                    }),
                    hand: new HandModel({
                        child: { cards: [new MurlocTidehunterModel({})] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageModel({}),
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

    test('battlecry', async () => {
        const boardA = game.child.playerA.child.board;
        const handA = game.child.playerA.child.hand;
        const cardA = handA.child.cards.find(item => item instanceof MurlocTidehunterModel);
        expect(cardA).toBeDefined();
        if (!cardA) return;
        
        expect(boardA.child.cards.length).toBe(1);
        expect(boardA.child.cards[0] instanceof WispModel).toBe(true);
        
        // Play Murloc Tidehunter to the left of Wisp
        let promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;

        expect(boardA.child.cards.length).toBe(3);
        console.log(boardA.child.cards.map(item => item.name))
        expect(boardA.child.cards[0] instanceof MurlocTidehunterModel).toBe(true);
        expect(boardA.child.cards[1] instanceof MurlocScoutModel).toBe(true);
        expect(boardA.child.cards[2] instanceof WispModel).toBe(true);
    })
}) 