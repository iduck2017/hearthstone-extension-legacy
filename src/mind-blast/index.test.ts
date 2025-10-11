/**
 * Test cases for Mind Blast
 * 
 * Initial state: Player A has Mind Blast in hand.
 * Player B's hero has full health (30).
 * 
 * 1. mind-blast-cast: Player A uses Mind Blast, deals 5 damage to Player B's hero.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { MindBlastModel } from "./index";
import { boot } from "../boot";

describe('mind-blast', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [] }
                    }),
                    hand: new HandModel({
                        child: { 
                            minions: [],
                            spells: [new MindBlastModel()]
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
                        child: { minions: [] }
                    }),
                    hand: new HandModel({
                        child: { spells: [] }
                    })
                }
            })
        }
    });
    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const heroB = playerB.child.hero;
    const handA = playerA.child.hand;
    const cardC = handA.child.spells.find(item => item instanceof MindBlastModel);
    const roleB = heroB.child.role;
    if (!cardC) throw new Error();

    test('mind-blast-cast', async () => {
        // Check initial state
        expect(roleB.child.health.state.current).toBe(30); // Full health
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.refer.queue?.length).toBe(1);

        // Player A uses Mind Blast
        const promise = cardC.play();
        await promise;

        // Player B's hero should take 5 damage
        expect(roleB.child.health.state.current).toBe(25); // 30 - 5 = 25

        // Mind Blast should be consumed
        expect(handA.refer.queue?.length).toBe(0); // Mind Blast consumed
        expect(playerA.child.mana.state.current).toBe(8); // 10 - 2 cost
    });
});
