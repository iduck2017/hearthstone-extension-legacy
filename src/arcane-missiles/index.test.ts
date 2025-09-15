/**
 * Test cases for Arcane Missiles
 * 
 * 1. arcane-missiles-damage: Player A plays Arcane Missiles and deals 3 damage randomly split among all enemies
 * 2. arcane-missiles-multiple-targets: Player A plays Arcane Missiles with multiple enemy targets
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel } from "hearthstone-core";
import { ArcaneMissilesModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('arcane-missiles', () => {
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
                        child: { spells: [new ArcaneMissilesModel()] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [] }
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
    const handA = playerA.child.hand;
    const roleB = playerB.child.hero.child.role;
    const cardD = handA.child.spells.find(item => item instanceof ArcaneMissilesModel);
    if (!cardD) throw new Error();

    test('arcane-missiles-cast', async () => {
        expect(roleB.child.health.state.current).toBe(30);
        expect(playerA.child.mana.state.current).toBe(10);
        
        // Play Arcane Missiles - no target selection needed
        await cardD.play();

        expect(playerA.child.mana.state.current).toBe(9);
        // Hero should take exactly 3 damage (since no other enemies)
        expect(roleB.child.health.state.current).toBe(27);
        expect(roleB.child.health.state.damage).toBe(3);
    })
})