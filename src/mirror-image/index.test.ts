/**
 * Test cases for Mirror Image
 * 
 * 1. mirror-image-cast: Player A plays Mirror Image, summons two 0/2 minions with Taunt
 * 2. mirror-image-taunt: Player B's Wisp cannot attack Player A's hero due to Taunt
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, SelectUtil } from "hearthstone-core";
import { MirrorImageModel } from "./index";
import { MirrorImageMinionModel } from "./minion";
import { WispModel } from "../wisp";
import { boot } from "../boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('mirror-image', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [] }
                    })),
                    hand: new HandModel(() => ({
                        child: { spells: [new MirrorImageModel()] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new WispModel()] }
                    })),
                    hand: new HandModel(() => ({
                        child: { spells: [] }
                    }))
                }
            }))
        }
    }));
    boot(game);
    
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    const cardA = handA.child.spells.find(item => item instanceof MirrorImageModel);
    const wispB = boardB.child.minions.find(item => item instanceof WispModel);
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = wispB?.child.role;
    if (!cardA || !roleC) throw new Error();

    test('mirror-image-cast', async () => {
        expect(boardA.child.minions.length).toBe(0);
        
        // Play Mirror Image
        await cardA.play();

        // Should summon two 0/2 minions with Taunt
        expect(boardA.child.minions.length).toBe(2);
        expect(boardA.child.minions[0] instanceof MirrorImageMinionModel).toBe(true);
        expect(boardA.child.minions[1] instanceof MirrorImageMinionModel).toBe(true);
        
        // Check minion stats
        const cardD = boardA.child.minions[0];
        const cardE = boardA.child.minions[1];
        if (!cardD || !cardE) throw new Error();
        const roleD = cardD.child.role;
        const roleE = cardE.child.role;
        
        expect(roleD.child.attack.state.origin).toBe(0);
        expect(roleD.child.health.state.origin).toBe(2);
        expect(roleE.child.attack.state.origin).toBe(0);
        expect(roleE.child.health.state.origin).toBe(2);
    })

    test('mirror-image-taunt', async () => {
        const turn = game.child.turn;
        turn.next();
        expect(turn.refer.current).toBe(playerB);
        
        // B's Wisp should not be able to attack A's hero due to Taunt
        expect(roleC.child.action.status).toBe(true);
        
        const cardD = boardA.child.minions[0];
        const cardE = boardA.child.minions[1];
        if (!cardD || !cardE) throw new Error();
        const roleD = cardD.child.role;
        const roleE = cardE.child.role;

        // Try to attack A's hero - should fail due to Taunt
        const promise = roleC.child.action.run();
        expect(SelectUtil.current?.options.length).toBe(2);
        expect(SelectUtil.current?.options).not.toContain(roleA);
        expect(SelectUtil.current?.options).toContain(roleD);
        expect(SelectUtil.current?.options).toContain(roleE);
        SelectUtil.set(roleD);
        await promise;
        
        // Wisp should not have attacked (due to Taunt blocking)
        expect(roleD.child.health.state.current).toBe(1);
    })
}) 