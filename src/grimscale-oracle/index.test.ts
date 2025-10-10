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
        expect(roleE.child.attack.state.current).toBe(2);
        expect(roleF.child.attack.state.current).toBe(2);
        expect(roleD.child.attack.state.current).toBe(1);
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

        expect(roleE.child.attack.state.current).toBe(3); // Ally's Murloc
        expect(roleE.child.attack.state.origin).toBe(2); // Original attack
        
        expect(roleF.child.attack.state.current).toBe(2); // Opponent's Murloc
        expect(roleD.child.attack.state.current).toBe(1); // Wisp 
        expect(roleC.child.attack.state.current).toBe(1); // Grimscale Oracle self
    })

    test('murloc-raider-attack-grimscale-oracle', async () => {
        turn.next();
        expect(game.child.turn.refer.current).toBe(game.child.playerB);
        expect(roleF.child.action.state.current).toBe(1);

        // Murloc Raider attacks Grimscale Oracle
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

        expect(roleF.child.action.state.current).toBe(0); // Murloc Raider
        expect(roleF.child.health.state.current).toBe(0); // Murloc Raider
        expect(cardF.child.dispose.status).toBe(true); // Murloc Raider

        expect(roleC.child.health.state.current).toBe(-1); // Grimscale Oracle
        expect(cardC.child.dispose.status).toBe(true);

        expect(boardB.child.minions.length).toBe(0);
        expect(boardA.child.minions.length).toBe(2);

        expect(roleE.child.attack.state.current).toBe(2); // Ally's Murloc
        expect(roleD.child.attack.state.current).toBe(1); // Wisp
    })
}) 