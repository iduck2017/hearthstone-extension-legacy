import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil, DeathStatus } from "hearthstone-core";
import { ShatteredSunClericModel } from "../src/shattered-sun-cleric";
import { WispModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('shattered-sun-cleric', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    board: new BoardModel({
                        child: { cards: [new WispModel({})] }
                    }),
                    hand: new HandModel({
                        child: { cards: [new ShatteredSunClericModel({})] }
                    })
                }
            }),
            playerB: new MageModel({
                child: {
                    hand: new HandModel({
                        child: { cards: [
                            new ShatteredSunClericModel({}),
                            new WispModel({})
                        ]}
                    })
                }
            })
        }
    }));
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const handB = game.child.playerB.child.hand;
    const cardA = handA.child.cards.find(item => item instanceof ShatteredSunClericModel);
    const cardB = boardA.child.cards.find(item => item instanceof WispModel);
    const cardC = handB.child.cards.find(item => item instanceof ShatteredSunClericModel);
    const cardD = handB.child.cards.find(item => item instanceof WispModel);
    const roleA = cardA?.child.minion;
    const roleB = cardB?.child.minion;
    const roleC = cardC?.child.minion;
    const roleD = cardD?.child.minion;
    const roleE = game.child.playerB.child.role;
    if (!roleA || !roleB || !roleC || !roleD) throw new Error();
    const turn = game.child.turn;

    test('shattered-sun-cleric-battlecry', async () => {
        let promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await TimeUtil.sleep();
        
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options.length).toBe(1);
        SelectUtil.set(roleB);
        await promise;
        
        expect(boardA.child.cards.length).toBe(2);
        expect(roleB.state.attack).toBe(2);
        expect(roleB.child.attack.state.origin).toBe(1);
        expect(roleB.child.attack.state.offset).toBe(1);
        expect(roleB.child.attack.state.current).toBe(2);
        expect(roleB.state.health).toBe(2);
        expect(roleB.child.health.state.limit).toBe(2);
        expect(roleB.child.health.state.origin).toBe(1);
        expect(roleB.child.health.state.offset).toBe(1);
        expect(roleB.child.health.state.damage).toBe(0);
        expect(roleB.child.health.state.memory).toBe(2);
        expect(roleB.child.health.state.current).toBe(2);
    })

    test('shattered-sun-cleric-play', async () => {
        turn.next();
        
        // Player B has no minions on board, so battlecry cannot trigger
        expect(boardB.child.cards.length).toBe(0);
        let promise = cardC.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeUndefined();
        await promise;
        
        expect(boardB.child.cards.length).toBe(1);
        promise = cardD.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;

        expect(boardB.child.cards.length).toBe(2);
        expect(roleD.state.action).toBe(1);
        expect(roleD.state.health).toBe(1);
    })

    test('wisp-attack', async () => {
        turn.next();

        expect(turn.refer.current).toBe(game.child.playerA);
        let promise = roleB.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleD);
        expect(SelectUtil.current?.options).toContain(roleE);
        expect(SelectUtil.current?.options.length).toBe(3);
        SelectUtil.set(roleD);
        await promise;
        
        expect(roleB.state.attack).toBe(2);
        expect(roleB.state.health).toBe(1);
        expect(roleB.state.action).toBe(0);
        expect(roleB.child.health.state.damage).toBe(1);
        expect(roleB.child.health.state.offset).toBe(1);
        expect(roleB.child.death.state.status).toBe(DeathStatus.INACTIVE);
        expect(roleD.state.attack).toBe(1);
        expect(roleD.state.health).toBe(-1);
        expect(roleD.state.action).toBe(1);
        expect(roleD.child.health.state.damage).toBe(2);
        expect(roleD.child.health.state.offset).toBe(0);
        expect(roleD.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(boardB.child.cards.length).toBe(1);
        expect(boardA.child.cards.length).toBe(2);
    })
})


