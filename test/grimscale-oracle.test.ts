/**
 * Test cases for Grimscale Oracle and Murloc Raider
 * 
 * Requirements:
 * 1. start: Player A has a raider on board and oracle in hand, Player B has a raider on board
 * 2. aura: Both raiders initially have 2 attack, after Player A plays oracle, Player A's raider gains +1 attack, no attack occurs
 */

import { GameModel, PlayerModel, HandModel, BoardModel, MageModel, TimeUtil, SelectUtil, DeathStatus, ManaModel } from "hearthstone-core";
import { GrimscaleOracleModel } from "../src/grimscale-oracle";
import { MurlocRaiderCard } from "../src/murloc-raider";
import { WispModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('grimscale-oracle', () => {
    const game = new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    board: new BoardModel({
                        child: { cards: [
                            new MurlocRaiderCard({}),
                            new WispModel({})
                        ]}
                    }),
                    hand: new HandModel({
                        child: { cards: [new GrimscaleOracleModel({})] }
                    }),
                }
            }),
            playerB: new MageModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    board: new BoardModel({
                        child: { cards: [new MurlocRaiderCard({})] }
                    })
                }
            })
        }
    })
    const root = boot(game);
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const cardA = boardA.child.cards.find(item => item instanceof MurlocRaiderCard);
    const cardB = boardB.child.cards.find(item => item instanceof MurlocRaiderCard);
    const cardC = handA.child.cards.find(item => item instanceof GrimscaleOracleModel);
    const cardD = boardA.child.cards.find(item => item instanceof WispModel);
    const roleA = cardA?.child.minion;
    const roleB = cardB?.child.minion;
    const roleC = cardC?.child.minion;
    const roleD = cardD?.child.minion;
    if (!roleA || !roleB || !roleC || !roleD) throw new Error();
    const turn = game.child.turn;

    test('minions-initial-state', async () => {
        expect(roleA.state.attack).toBe(2);
        expect(roleB.state.attack).toBe(2);
        expect(roleD.state.attack).toBe(1);
    })

    test('grimscale-oracle-buff', async () => {
        const promise = cardC.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options.length).toBe(3);
        SelectUtil.set(0);
        await promise;

        expect(boardA.child.cards.length).toBe(3);
        expect(boardB.child.cards.length).toBe(1);

        expect(roleA.state.attack).toBe(3);
        expect(roleA.child.attack.state.offset).toBe(1);
        expect(roleA.child.attack.state.origin).toBe(2);
        expect(roleB.state.attack).toBe(2);
        expect(roleD.state.attack).toBe(1);
        expect(roleC.state.attack).toBe(1);
    })

    
    test('murloc-raider-attack-grimscale-oracle', async () => {
        
        turn.next();
        expect(game.child.turn.refer.current).toBe(game.child.playerB);
        expect(roleB.state.action).toBe(1);
        const promise = roleB.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options.length).toBe(4);
        expect(SelectUtil.current?.options).toContain(roleA);
        expect(SelectUtil.current?.options).toContain(roleC);
        expect(SelectUtil.current?.options).toContain(roleD);
        expect(SelectUtil.current?.options).toContain(game.child.playerA.child.role); 
        SelectUtil.set(roleC);
        await promise;

        expect(roleB.state.action).toBe(0)
        expect(roleB.state.health).toBe(0);
        expect(roleB.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(roleC.state.health).toBe(-1);
        expect(roleC.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(boardB.child.cards.length).toBe(0);
        expect(boardA.child.cards.length).toBe(2);
        expect(roleA.state.attack).toBe(2);
        expect(roleD.state.attack).toBe(1);
    })

}) 