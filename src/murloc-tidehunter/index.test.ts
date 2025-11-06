/**
 * Test cases for Murloc Tidehunter
 * 
 * 1. murloc-tidehunter-battlecry: Player A plays Murloc Tidehunter, summons a 1/1 Murloc Scout
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel } from "hearthstone-core";
import { MurlocTidehunterModel } from "./index";
import { MurlocScoutModel } from "../murloc-scout";
import { WispModel } from "../wisp";
import { boot } from "../boot";



describe('murloc-tidehunter', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [new WispModel()] }
                    }),
                    hand: new HandModel({
                        child: { minions: [new MurlocTidehunterModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [] }
                    }),
                    hand: new HandModel({
                        child: { minions: [] }
                    })
                }
            })
        }
    });
    boot(game);
    
    const boardA = game.child.playerA.child.board;
    const handA = game.child.playerA.child.hand;
    const cardA = handA.child.minions.find(item => item instanceof MurlocTidehunterModel);
    if (!cardA) throw new Error();

    test('murloc-tidehunter-battlecry', async () => {
        expect(boardA.child.minions.length).toBe(1);
        expect(boardA.child.minions[0] instanceof WispModel).toBe(true);
        
        // Play Murloc Tidehunter to the left of Wisp
        let promise = cardA.play();
        expect(game.child.playerA.child.controller.current?.options).toContain(0);
        game.child.playerA.child.controller.set(0);
        await promise;

        expect(boardA.child.minions.length).toBe(3);
        expect(boardA.refer.queue.length).toBe(3);
        expect(boardA.refer.queue[0] instanceof MurlocTidehunterModel).toBe(true);
        expect(boardA.refer.queue[1] instanceof MurlocScoutModel).toBe(true);
        expect(boardA.refer.queue[2] instanceof WispModel).toBe(true);
    })
}) 