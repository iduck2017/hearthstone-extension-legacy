/**
 * Test cases for Arcane Devourer
 * 
 * Initial state: Player A has Arcane Devourer on board and Fireball in hand.
 * Player B has Fireball in hand.
 * 
 * 1. fireball-cast: Player A's Arcane Devourer gains +2/+2 when Player A casts a spell.
 * 2. frostbolt-cast: Player B's spell does not trigger Player A's Arcane Devourer.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { ArcaneDevourerModel } from "./index";
import { FireballModel } from "../fireball";
import { boot } from "../boot";
import { FrostboltModel } from "../frostbolt";

describe('arcane-devourer', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            minions: [new ArcaneDevourerModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            minions: [],
                            spells: [new FireballModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { minions: [] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            minions: []
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            minions: [],
                            spells: [new FrostboltModel()]
                        }
                    })
                }
            })
        }
    });
    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const handA = playerA.child.hand;
    const handB = playerB.child.hand;
    const cardC = handA.refer.queue?.find(item => item instanceof FireballModel);
    const cardD = handB.refer.queue?.find(item => item instanceof FrostboltModel);
    const cardE = boardA.refer.queue?.find(item => item instanceof ArcaneDevourerModel);
    if (!cardC || !cardD || !cardE) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleE = cardE.child.role;

    test('fireball-cast', async () => {
        // Check initial stats
        expect(roleE.child.attack.state.current).toBe(4); // Arcane Devourer: 4/8
        expect(roleE.child.health.state.current).toBe(8);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.refer.queue?.filter(item => item instanceof FireballModel).length).toBe(1);

        // Player A casts Fireball
        const promise = cardC.play();
        expect(SelectUtil.current?.options).toContain(roleA); // Can target friendly hero
        expect(SelectUtil.current?.options).toContain(roleB); // Can target enemy hero
        SelectUtil.set(roleB); // Target Player B's hero
        await promise;

        // Arcane Devourer should gain +2/+2
        expect(roleE.child.attack.state.current).toBe(6); // 4 + 2
        expect(roleE.child.health.state.current).toBe(10); // 8 + 2
        expect(playerA.child.mana.state.current).toBe(6); // 10 - 4 cost (Fireball costs 4)
        expect(handA.refer.queue?.filter(item => item instanceof FireballModel).length).toBe(0);
    });

    test('frostbolt-cast', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);
        
        // Check initial stats
        expect(roleE.child.attack.state.current).toBe(6); // Previous buff
        expect(roleE.child.health.state.current).toBe(10);
        expect(playerB.child.mana.state.current).toBe(10);
        expect(handB.refer.queue?.filter(item => item instanceof FrostboltModel).length).toBe(1);

        // Player B casts Frostbolt
        const promise = cardD.play();
        expect(SelectUtil.current?.options).toContain(roleA); // Can target friendly hero
        expect(SelectUtil.current?.options).toContain(roleB); // Can target enemy hero
        SelectUtil.set(roleA); // Target Player A's hero
        await promise;

        // Arcane Devourer should NOT gain stats (enemy spell)
        expect(roleE.child.attack.state.current).toBe(6); // unchanged
        expect(roleE.child.health.state.current).toBe(10); // unchanged
        expect(playerB.child.mana.state.current).toBe(8); // 10 - 2 cost (Frostbolt costs 2)
        expect(handB.refer.queue?.filter(item => item instanceof FrostboltModel).length).toBe(0);
    });
});
