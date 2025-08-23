// Test scenario:
// Initial setup: Player A has Leper Gnome on board, Player B has Wisp on board
// Test case: Player A's Leper Gnome attacks Player B's Wisp, both die, Player B loses 2 health

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil, DeathStatus } from "hearthstone-core";
import { LeperGnomeModel } from "../src/leper-gnome";
import { WispModel } from "../src/wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('leper-gnome', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new LeperGnomeModel({})] }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [new WispModel({})] }
                    }),
                }
            })
        }
    }));

    test('deathrattle', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof LeperGnomeModel);
        const cardB = boardB.child.cards.find(item => item instanceof WispModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA) return;
        if (!cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        const heroB = game.child.playerB.child.hero.child.role;
        expect(boardA.child.cards.length).toBe(1);
        expect(boardB.child.cards.length).toBe(1);
        expect(roleA.state.attack).toBe(2);
        expect(roleA.state.health).toBe(1);
        expect(roleB.state.attack).toBe(1);
        expect(roleB.state.health).toBe(1);
        expect(heroB.state.health).toBe(30);

        let promise = roleA.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options.length).toBe(2);
        SelectUtil.set(roleB);
        await promise;
        
        expect(boardA.child.cards.length).toBe(0);
        expect(boardB.child.cards.length).toBe(0);
        expect(roleA.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(roleB.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(heroB.state.health).toBe(28);
        expect(heroB.child.health.state.damage).toBe(2);
    })
})
