// Test scenario:
// Initial setup: Player A has Tidehunter, Tidecaller, Raider in hand, Player B has Tidehunter in hand
// Test case 1: Player A plays Raider, Tidecaller in hand, status unchanged
// Test case 2: Player A plays Tidecaller, then plays another Tidehunter, Tidecaller gains +2 Attack
// Test case 3: Turn ends, Player B plays Tidehunter, Player A's Tidecaller status unchanged

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil } from "hearthstone-core";
import { MurlocTidecallerModel } from "../src/murloc-tidecaller";
import { MurlocTidehunterModel } from "../src/murloc-tidehunter";
import { MurlocRaiderCard } from "../src/murloc-raider";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('murloc-tidecaller', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { cards: [
                            new MurlocTidehunterModel({}),
                            new MurlocTidecallerModel({}),
                            new MurlocRaiderCard({})
                        ]}
                    })
                }
            }),
            playerB: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { cards: [new MurlocTidehunterModel({})] }
                    })
                }
            })
        }
    }));

    test('summon', async () => {
        const handA = game.child.playerA.child.hand;
        const cardA = handA.child.cards.find(item => item instanceof MurlocRaiderCard);
        const cardB = handA.child.cards.find(item => item instanceof MurlocTidecallerModel);
        const boardA = game.child.playerA.child.board;
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        const roleB = cardB.child.role;
        
        expect(roleB.state.attack).toBe(1);
        expect(roleB.child.attack.state.origin).toBe(1);
        expect(roleB.child.attack.state.offset).toBe(0);
        
        // Play Raider
        let promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        
        expect(boardA.child.cards.length).toBe(1);
        expect(roleB.state.attack).toBe(1);
        expect(roleB.child.attack.state.origin).toBe(1);
        expect(roleB.child.attack.state.offset).toBe(0);
    })

    test('trigger', async () => {
        const handA = game.child.playerA.child.hand;
        const boardA = game.child.playerA.child.board;
        const cardA = handA.child.cards.find(item => item instanceof MurlocTidecallerModel);
        const cardB = handA.child.cards.find(item => item instanceof MurlocTidehunterModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        const roleA = cardA.child.role;
        
        expect(roleA.state.attack).toBe(1);
        expect(roleA.child.attack.state.origin).toBe(1);
        expect(roleA.child.attack.state.offset).toBe(0);
        
        // Play Tidecaller
        let promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        
        expect(boardA.child.cards.length).toBe(2);
        expect(roleA.state.attack).toBe(1);
        expect(roleA.child.attack.state.origin).toBe(1);
        expect(roleA.child.attack.state.offset).toBe(0);
        
        // Play Tidehunter
        promise = cardB.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        
        expect(boardA.child.cards.length).toBe(4);
        expect(roleA.state.attack).toBe(3);
        expect(roleA.child.attack.state.origin).toBe(1);
        expect(roleA.child.attack.state.offset).toBe(2);
        expect(roleA.child.features.child.items.length).toBe(3);
    })

    test('opponent-summon', async () => {
        const turn = game.child.turn;
        turn.next();
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const handB = game.child.playerB.child.hand;
        const cardA = boardA.child.cards.find(item => item instanceof MurlocTidecallerModel);
        const cardB = handB.child.cards.find(item => item instanceof MurlocTidehunterModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        const roleA = cardA.child.role;
        
        expect(roleA.state.attack).toBe(3);
        expect(roleA.child.attack.state.origin).toBe(1);
        expect(roleA.child.attack.state.offset).toBe(2);
        
        // Player B plays Tidehunter
        let promise = cardB.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        
        expect(boardB.child.cards.length).toBe(2);
        expect(roleA.state.attack).toBe(3);
        expect(roleA.child.attack.state.origin).toBe(1);
        expect(roleA.child.attack.state.offset).toBe(2);
    })
}) 