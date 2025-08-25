/*
Test scenario for Sunfury Protector:

Initial: Player A has wisp, hungry-crab, and loot-hoarder on board in that order, and sunfury-protector in hand. Player B has wisp on board.
1. Player A plays sunfury-protector between wisp and hungry-crab, they get Taunt, but loot-hoarder doesn't
2. Turn ends, Player B's wisp attacks, targets include wisp and hungry-crab, but not protector, hoarder, or Player A
*/

import { GameModel, BoardModel, HandModel, MageModel, TimeUtil, SelectUtil, ManaModel } from "hearthstone-core";
import { SunfuryProtectorModel } from "../src/sunfury-protector";
import { WispModel } from "../src/wisp";
import { HungryCrabModel } from "../src/hungry-crab";
import { LootHoarderModel } from "../src/loot-hoarder";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('sunfury-protector', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    board: new BoardModel({
                        child: { 
                            cards: [
                                new WispModel({}),
                                new HungryCrabModel({}),
                                new LootHoarderModel({})
                            ] 
                        }
                    }),
                    hand: new HandModel({
                        child: { cards: [new SunfuryProtectorModel({})] }
                    }),
                }
            }),
            playerB: new MageModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    board: new BoardModel({
                        child: { cards: [new WispModel({})] }
                    }),
                }
            })
        }
    }));
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const cardA = boardA.child.cards.find(item => item instanceof WispModel);
    const cardB = boardA.child.cards.find(item => item instanceof HungryCrabModel);
    const cardC = boardA.child.cards.find(item => item instanceof LootHoarderModel);
    const cardD = handA.child.cards.find(item => item instanceof SunfuryProtectorModel);
    const cardE = boardB.child.cards.find(item => item instanceof WispModel);
    const roleA = cardA?.child.minion;
    const roleB = cardB?.child.minion;
    const roleC = cardC?.child.minion;
    const roleD = cardD?.child.minion;
    const roleE = cardE?.child.minion;
    if (!roleA || !roleB || !roleC || !roleD || !roleE) throw new Error();

    test('sunfury-protector-battlecry', async () => {
        // Check initial state - no minions should have taunt
        expect(boardA.child.cards.length).toBe(3);
        expect(handA.child.cards.length).toBe(1);
        expect(roleA.child.entries.child.taunt.state.status).toBe(0);
        expect(roleB.child.entries.child.taunt.state.status).toBe(0);
        expect(roleC.child.entries.child.taunt.state.status).toBe(0);
        
        // Play Sunfury Protector at position 1 (between wisp and hungry-crab)
        const promise = cardD.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options.length).toBe(4); // 4 positions available
        expect(SelectUtil.current?.options).toContain(1); // Position 1
        SelectUtil.set(1); // Place between wisp and hungry-crab
        await promise;
        
        // Check final state - adjacent minions should have taunt
        expect(boardA.child.cards.length).toBe(4);
        expect(handA.child.cards.length).toBe(0);
        expect(roleA.child.entries.child.taunt.state.status).toBe(1); // wisp has taunt
        expect(roleB.child.entries.child.taunt.state.status).toBe(1); // hungry-crab has taunt
        expect(roleC.child.entries.child.taunt.state.status).toBe(0); // loot-hoarder doesn't have taunt
    })

    test('wisp-attack', async () => {
        // End turn to give control to player B
        game.child.turn.next();
        
        // Check that player B's wisp can attack
        expect(roleE.state.action).toBe(1);
        
        // Try to attack with player B's wisp
        const promise = roleE.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        
        // Check available targets - should include wisp and hungry-crab (with taunt)
        // but not protector, hoarder, or player A
        const options = SelectUtil.current?.options || [];
        expect(options).toContain(roleA); // wisp with taunt
        expect(options).toContain(roleB); // hungry-crab with taunt
        expect(options).not.toContain(game.child.playerA.child.role); // player A not targetable
        expect(options).not.toContain(roleC); // loot-hoarder not targetable
        expect(options).not.toContain(roleD); // protector not targetable

        // Cancel the attack
        SelectUtil.set(undefined);
        await promise;
    })
}) 