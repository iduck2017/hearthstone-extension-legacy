/**
 * Test cases for Ethereal Arcanist
 * 
 * 1. end-turn: Player A ends turn with secret, Arcanist becomes 5/5
 * 2. wisp-attack: Player B's Wisp attacks Player A's hero, triggers Ice Barrier
 * 3. end-turn: Next turn, Arcanist no longer grows (no secret)
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil } from "hearthstone-core";
import { EtherealArcanistModel } from "./index";
import { IceBarrierModel } from "../ice-barrier";
import { WispModel } from "../wisp";
import { boot } from "../boot";
import { DebugUtil } from "set-piece";

DebugUtil.mute(true)
describe('ethereal-arcanist', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { 
                            minions: [new EtherealArcanistModel()],
                            secrets: [new IceBarrierModel()]
                        }
                    })),
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { 
                            minions: [new WispModel()]
                        }
                    })),
                }
            }))
        }
    }));
    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const cardC = boardA.child.minions.find(item => item instanceof EtherealArcanistModel);
    const cardD = boardB.child.minions.find(item => item instanceof WispModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    const heroA = playerA.child.hero;
    const roleA = heroA.child.role;
    if (!roleC || !roleD) throw new Error();

    test('end-turn', async () => {
        // Check initial stats
        expect(boardA.child.minions.length).toBe(1);
        expect(boardA.child.secrets.length).toBe(1);
        expect(roleC.child.attack.state.current).toBe(3); // Arcanist: 3/3
        expect(roleC.child.health.state.current).toBe(3);
        expect(roleA.child.health.state.current).toBe(30); // Player A hero: 30 health

        // Player A ends turn
        game.child.turn.next();

        // Check Arcanist gained +2/+2 due to secret
        expect(roleC.child.attack.state.current).toBe(5); // 3 + 2 = 5
        expect(roleC.child.health.state.current).toBe(5); // 3 + 2 = 5
        expect(boardA.child.secrets.length).toBe(1); // Secret still active
    });

    test('wisp-attack', async () => {
        // Check current stats
        expect(roleA.child.health.state.current).toBe(30); // Player A hero: 30 health

        // Player B's Wisp attacks Player A's hero
        const promise = roleD.child.action.run();
        expect(SelectUtil.current?.options).toContain(roleA);
        SelectUtil.set(roleA);
        await promise;

        // Check Ice Barrier triggered: Player A gains 8 armor
        expect(roleA.child.health.state.current).toBe(30); // 30 + 8 - 1 = 37
        expect(heroA.child.armor.state.origin).toBe(7);
        expect(boardA.child.secrets.length).toBe(0); // Secret consumed
    });

    test('end-turn', async () => {
        // Turn passes to Player A
        game.child.turn.next();

        // Check Arcanist does not grow (no secret)
        expect(roleC.child.attack.state.current).toBe(5); // Still 5/5, no growth
        expect(roleC.child.health.state.current).toBe(5);
        expect(boardA.child.secrets.length).toBe(0); // No secrets

        game.child.turn.next();

        expect(roleC.child.attack.state.current).toBe(5); // Still 5/5, no growth
        expect(roleC.child.health.state.current).toBe(5);
        expect(boardA.child.secrets.length).toBe(0); // No secrets
    });
});
