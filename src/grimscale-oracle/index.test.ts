/**
 * Test cases for Grimscale Oracle
 * 
 * 1. grimscale-oracle-buff: Player A plays Grimscale Oracle, Player A's Murloc gains +1 Attack
 * 2. murloc-raider-attack: Player B's Murloc attacks Player A's Oracle, both die
 */
import { GameModel, PlayerModel, HandModel, BoardModel, MageModel, TimeUtil, SelectUtil, ManaModel } from "hearthstone-core";
import { GrimscaleOracleModel } from ".";
import { MurlocRaiderModel } from "../murloc-raider";
import { WispModel } from "../wisp";
import { boot } from "../boot";
import { DebugUtil, LogLevel } from "set-piece";

describe('grimscale-oracle', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [
                            new MurlocRaiderModel(),
                            new WispModel()
                        ]}
                    })),
                    hand: new HandModel(() => ({
                        child: { minions: [new GrimscaleOracleModel()] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new MurlocRaiderModel()] }
                    }))
                }
            }))
        }
    }));
    const root = boot(game);
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const cardC = handA.child.minions.find((item: any) => item instanceof GrimscaleOracleModel);
    const cardD = boardA.child.minions.find((item: any) => item instanceof WispModel);
    const cardE = boardA.child.minions.find((item: any) => item instanceof MurlocRaiderModel);
    const cardF = boardB.child.minions.find((item: any) => item instanceof MurlocRaiderModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    const roleE = cardE?.child.role;
    const roleF = cardF?.child.role;
    if (!roleE || !roleF || !roleC || !roleD) throw new Error();
    const turn = game.child.turn;

    test('minions-initial-state', async () => {
        expect(roleE.state.attack).toBe(2);
        expect(roleF.state.attack).toBe(2);
        expect(roleD.state.attack).toBe(1);
    })

    test('grimscale-oracle-buff', async () => {
        const promise = cardC.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options.length).toBe(3);
        SelectUtil.set(0);
        await promise;

        expect(boardA.child.minions.length).toBe(3);
        expect(boardB.child.minions.length).toBe(1);

        expect(roleE.child.attack.state.current).toBe(3);
        expect(roleE.child.attack.state.offset).toBe(1);
        expect(roleE.child.attack.state.origin).toBe(2);
        expect(roleF.state.attack).toBe(2);
        expect(roleD.state.attack).toBe(1);
        expect(roleC.state.attack).toBe(1);
    })

    test('murloc-raider-attack-grimscale-oracle', async () => {
        turn.next();
        expect(game.child.turn.refer.current).toBe(game.child.playerB);
        expect(roleF.state.action).toBe(1);
        const promise = roleF.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options.length).toBe(4);
        expect(SelectUtil.current?.options).toContain(roleE);
        expect(SelectUtil.current?.options).toContain(roleC);
        expect(SelectUtil.current?.options).toContain(roleD);
        expect(SelectUtil.current?.options).toContain(game.child.playerA.child.hero.child.role); 
        SelectUtil.set(roleC);
        await promise;

        expect(roleF.state.action).toBe(0)
        expect(roleF.state.health).toBe(0);
        expect(cardF.child.dispose.state.isActive).toBe(true);
        expect(roleC.state.health).toBe(-1);
        expect(cardC.child.dispose.state.isActive).toBe(true);
        expect(boardB.child.minions.length).toBe(0);
        expect(boardA.child.minions.length).toBe(2);
        expect(roleE.state.attack).toBe(2);
        expect(roleD.state.attack).toBe(1);
    })
}) 