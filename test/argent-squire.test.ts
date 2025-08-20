import { GameModel, PlayerModel, MageModel, BoardModel, SelectUtil } from "hearthstone-core";
import { RouteUtil } from "set-piece";
import { ArgentSquireCardModel } from "../src/argent-squire";
import { boot } from "./boot";

describe('argent-squire', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new ArgentSquireCardModel({})] }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new ArgentSquireCardModel({})] }
                    })
                }
            })
        }
    })
    boot(game);

    test('attack', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof ArgentSquireCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof ArgentSquireCardModel);
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
        expect(roleA.child.devineShield.state.isActive).toBe(true);
        expect(roleB.child.devineShield.state.isActive).toBe(true);
        const promise = roleA.child.attack.run();
        expect(SelectUtil.current?.options).toContain(roleB);
        SelectUtil.set(roleB);
        await promise;
        expect(roleA.state.health).toBe(1);
        expect(roleB.state.health).toBe(1);
        expect(roleA.child.devineShield.state.isActive).toBe(false);
        expect(roleB.child.devineShield.state.isActive).toBe(false);
        expect(roleA.child.death.state.isDying).toBe(false);
        expect(roleB.child.death.state.isDying).toBe(false);
    })
})