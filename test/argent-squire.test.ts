import { GameModel, PlayerModel, MageModel, BoardModel, SelectUtil, DeathStatus } from "hearthstone-core";
import { ArgentSquireModel } from "../src/argent-squire";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('argent-squire', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new ArgentSquireModel({})] }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new ArgentSquireModel({})] }
                    })
                }
            })
        }
    })
    boot(game);

    test('attack', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof ArgentSquireModel);
        const cardB = boardB.child.cards.find(item => item instanceof ArgentSquireModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA) return;
        if (!cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        // First attack: both squires attack each other
        // Divine Shield blocks the damage, so no health is lost
        expect(roleA.state.health).toBe(1);
        expect(roleB.state.health).toBe(1);
        expect(roleA.child.entries.child.divineShield.state.status).toBe(1);
        expect(roleB.child.entries.child.divineShield.state.status).toBe(1);
        const promise = roleA.child.action.run();
        expect(SelectUtil.current?.options).toContain(roleB);
        SelectUtil.set(roleB);
        await promise;
        expect(roleA.state.health).toBe(1);
        expect(roleB.state.health).toBe(1);
        expect(roleA.child.entries.child.divineShield.state.status).toBe(0);
        expect(roleB.child.entries.child.divineShield.state.status).toBe(0);
        expect(roleA.child.death.state.status).toBe(DeathStatus.INACTIVE);
        expect(roleB.child.death.state.status).toBe(DeathStatus.INACTIVE);
    })
})