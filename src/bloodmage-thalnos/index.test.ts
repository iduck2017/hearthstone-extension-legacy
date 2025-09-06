/*
 * Test scenarios for Bloodmage Thalnos:
 * 1. Player A uses Bloodmage Thalnos to attack wisp, both die, Player A draws a card
 */

import { GameModel, BoardModel, DeckModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil, ManaModel } from "hearthstone-core";
import { BloodmageThalnosModel } from ".";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('bloodmage-thalnos', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    character: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new BloodmageThalnosModel()] }
                    })),
                    deck: new DeckModel(() => ({
                        child: { minions: [new WispModel()] }
                    })),
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    character: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new WispModel()] }
                    }))
                }
            }))
        }
    }));
    boot(game);
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const deckA = game.child.playerA.child.deck;
    const handA = game.child.playerA.child.hand;
    const cardC = boardA.child.minions.find((item: any) => item instanceof BloodmageThalnosModel);
    const cardD = boardB.child.minions.find((item: any) => item instanceof WispModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    if (!roleC || !roleD) throw new Error();

    test('bloodmage-thalnos-attack', async () => {
        // Verify initial state
        expect(boardA.child.minions.length).toBe(1);
        expect(boardB.child.minions.length).toBe(1);
        expect(deckA.child.minions.length).toBe(1);
        expect(handA.child.minions.length).toBe(0);
        expect(roleC.state.attack).toBe(1);
        expect(roleC.state.health).toBe(1);
        expect(roleD.state.attack).toBe(1);
        expect(roleD.state.health).toBe(1);
        
        // Player A uses Bloodmage Thalnos to attack wisp
        let promise = roleC.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleD);
        SelectUtil.set(roleD);
        await promise;
        
        // Verify both minions die
        expect(roleC.child.death.state.isActive).toBe(true);
        expect(roleD.child.death.state.isActive).toBe(true);
        expect(boardA.child.minions.length).toBe(0);
        expect(boardB.child.minions.length).toBe(0);
        
        // Verify deathrattle triggers and draws a card
        expect(deckA.child.minions.length).toBe(0);
        expect(handA.child.minions.length).toBe(1);
    });
}); 