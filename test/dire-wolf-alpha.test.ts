// Test scenarios for Dire Wolf Alpha:
// Initial: Player A has Dire Wolf Alpha in hand and 2 wisps on board, Player B has wisp on board
// 1. wisp attack is 1
// 2. Player A plays Dire Wolf Alpha, places it between two wisps, wisp attack becomes 2
// 3. Player A uses wisp to attack Player B's wisp, Player B's wisp dies with health -1, takes 2 damage

import { GameModel, BoardModel, HandModel, MageModel, TimeUtil, SelectUtil, DeathStatus, ManaModel } from "hearthstone-core";
import { DireWolfAlphaModel } from "../src/dire-wolf-alpha";
import { WispModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";
import { StonetuskBoarModel } from "../src";

DebugUtil.level = LogLevel.ERROR;
describe('dire-wolf-alpha', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    board: new BoardModel({
                        child: { cards: [
                            new WispModel({}),
                            new StonetuskBoarModel({})
                        ]}
                    }),
                    hand: new HandModel({
                        child: { cards: [new DireWolfAlphaModel({})] }
                    })
                }
            }),
            playerB: new MageModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    board: new BoardModel({
                        child: { cards: [new WispModel({})] }
                    })
                }
            })
        }
    }));
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const handB = game.child.playerB.child.hand;
    const cardA = handA.child.cards.find(item => item instanceof DireWolfAlphaModel);
    const cardB = boardA.child.cards.find(item => item instanceof WispModel);
    const cardC = boardA.child.cards.find(item => item instanceof StonetuskBoarModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    const roleA = cardA?.child.minion;
    const roleB = cardB?.child.minion;
    const roleC = cardC?.child.minion;
    const roleD = cardD?.child.minion;
    if (!roleA || !roleB || !roleC || !roleD) throw new Error();

    test('wisp-initial-state', async () => {
        // Verify wisp initial attack is 1
        expect(roleB.state.attack).toBe(1);
        expect(roleB.child.attack.state.origin).toBe(1);
        expect(roleB.child.attack.state.offset).toBe(0);
        expect(roleC.state.attack).toBe(1);
        expect(roleC.child.attack.state.origin).toBe(1);
        expect(roleC.child.attack.state.offset).toBe(0);
    });

    test('dire-wolf-alpha-play', async () => {
        // Player A plays Dire Wolf Alpha between two wisps
        let promise = cardA.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(1);
        SelectUtil.set(1);
        await promise;
        
        // Verify Dire Wolf Alpha is placed between wisps
        expect(boardA.child.cards.length).toBe(3);
        expect(boardA.child.cards[0] instanceof WispModel).toBe(true);
        expect(boardA.child.cards[1] instanceof DireWolfAlphaModel).toBe(true);
        expect(boardA.child.cards[2] instanceof StonetuskBoarModel).toBe(true);
        
        expect(roleB.state.attack).toBe(2);
        expect(roleB.child.attack.state.offset).toBe(1);
        expect(roleB.child.attack.state.origin).toBe(1);

        expect(roleB.state.attack).toBe(2);
        expect(roleB.child.attack.state.offset).toBe(1);
        expect(roleB.child.attack.state.origin).toBe(1);
    });

    test('wisp-attacks-wisp', async () => {
        expect(roleB.state.attack).toBe(2);

        // Player A uses wisp to attack Player B's wisp
        let promise = roleB.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleD);
        SelectUtil.set(roleD);
        await promise;
        
        // Verify Player B's wisp dies with health -1, takes 2 damage
        expect(roleD.state.health).toBe(-1);
        expect(roleD.child.health.state.damage).toBe(2);
        expect(roleD.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(boardB.child.cards.length).toBe(0);
        
        expect(roleB.state.health).toBe(0);
        expect(roleB.child.health.state.damage).toBe(1);
        expect(roleB.child.death.state.status).toBe(DeathStatus.ACTIVE);
    });
}); 