/**
 * Test cases for Grimscale Oracle and Murloc Raider
 * 
 * Requirements:
 * 1. start: Player A has a raider on board and oracle in hand, Player B has a raider on board
 * 2. aura: Both raiders initially have 2 attack, after Player A plays oracle, Player A's raider gains +1 attack, no attack occurs
 */

import { GameModel, PlayerModel, HandModel, BoardModel, MageModel, TimeUtil, SelectUtil } from "hearthstone-core";
import { GrimscaleOracleCardModel } from "../src/grimscale-oracle";
import { MurlocRaiderCardModel } from "../src/murloc-raider";
import { WispCardModel } from "../src/wisp";
import { boot } from "./boot";

describe('grimscale-oracle', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [
                            new MurlocRaiderCardModel({}),
                            new WispCardModel({})
                        ]}
                    }),
                    hand: new HandModel({
                        child: { cards: [new GrimscaleOracleCardModel({})] }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new MurlocRaiderCardModel({})] }
                    })
                }
            })
        }
    })
    const root = boot(game);

    test('start', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const handA = game.child.playerA.child.hand;
        const cardD = boardA.child.cards.find(item => item instanceof WispCardModel);
        const cardA = boardA.child.cards.find(item => item instanceof MurlocRaiderCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof MurlocRaiderCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        expect(cardD).toBeDefined();
        if (!cardA || !cardB || !cardD) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        const roleD = cardD.child.role;
        expect(roleA.state.attack).toBe(2);
        expect(roleB.state.attack).toBe(2);
        expect(roleD.state.attack).toBe(1);
    })

    test("buff", async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const handA = game.child.playerA.child.hand;
        const cardA = boardA.child.cards.find(item => item instanceof MurlocRaiderCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof MurlocRaiderCardModel);
        const cardC = handA.child.cards.find(item => item instanceof GrimscaleOracleCardModel);
        const cardD = boardA.child.cards.find(item => item instanceof WispCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        expect(cardC).toBeDefined();
        expect(cardD).toBeDefined();
        if (!cardA || !cardB || !cardC || !cardD) return;
        const promise = cardC.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options.length).toBe(3);
        SelectUtil.set(0);
        await promise;
        expect(boardA.child.cards.length).toBe(3);
        expect(boardB.child.cards.length).toBe(1);
        const roleA = cardA.child.role;
        const roleZ = cardB.child.role;
        const roleC = cardC.child.role;
        const roleD = cardD.child.role;
        expect(roleA.state.attack).toBe(3);
        expect(roleA.child.attack.state.offset).toBe(1);
        expect(roleA.child.attack.state.origin).toBe(2);
        expect(roleZ.state.attack).toBe(2);
        expect(roleD.state.attack).toBe(1);
        expect(roleC.state.attack).toBe(1);
    })

    
    test('attack', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const handA = game.child.playerA.child.hand;
        const cardA = boardA.child.cards.find(item => item instanceof MurlocRaiderCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof MurlocRaiderCardModel);
        const cardC = boardA.child.cards.find(item => item instanceof GrimscaleOracleCardModel);
        const cardD = boardA.child.cards.find(item => item instanceof WispCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        expect(cardC).toBeDefined();
        expect(cardD).toBeDefined();
        if (!cardA || !cardB || !cardC || !cardD) return;
        const roleA = cardA.child.role;
        const roleZ = cardB.child.role;
        const roleC = cardC.child.role;
        const roleD = cardD.child.role;
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(game.child.playerB);
        expect(roleZ.state.action).toBe(1);
        const promise = roleZ.child.attack.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options.length).toBe(4);
        expect(SelectUtil.current?.options).toContain(roleA);
        expect(SelectUtil.current?.options).toContain(roleC);
        expect(SelectUtil.current?.options).toContain(roleD);
        expect(SelectUtil.current?.options).toContain(game.child.playerA.child.hero.child.role); 
        SelectUtil.set(roleC);
        await promise;
        expect(roleZ.state.action).toBe(0)
        expect(roleZ.state.health).toBe(0);
        expect(roleZ.child.death.state.isDying).toBe(true);
        expect(roleC.state.health).toBe(-1);
        expect(roleC.child.death.state.isDying).toBe(true);
        expect(boardB.child.cards.length).toBe(0);
        expect(boardA.child.cards.length).toBe(2);
        expect(roleA.state.attack).toBe(2);
        expect(roleD.state.attack).toBe(1);
    })

}) 