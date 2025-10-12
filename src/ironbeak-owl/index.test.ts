/**
 * Test cases for Ironbeak Owl
 * 
 * Initial state: Player A has Ironbeak Owl in hand.
 * Player A has an Ancient Watcher on board.
 * 
 * 1. ironbeak-owl-play: Player A plays Ironbeak Owl, silencing Ancient Watcher.
 * 2. ancient-watcher-attack: Ancient Watcher can now attack (silence removed the restriction).
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil, AnimeUtil } from "hearthstone-core";
import { IronbeakOwlModel } from "./index";
import { AncientWatcherModel } from "../ancient-watcher";
import { boot } from "../boot";

describe('ironbeak-owl', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            minions: [new AncientWatcherModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            minions: [new IronbeakOwlModel()],
                            spells: []
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
                            spells: []
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
    const cardC = handA.refer.queue.find(item => item instanceof IronbeakOwlModel);
    const cardD = boardA.refer.queue.find(item => item instanceof AncientWatcherModel);
    if (!cardC || !cardD) throw new Error();
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC.child.role;
    const roleD = cardD.child.role;

    test('ironbeak-owl-play', async () => {
        // Check initial state
        expect(roleC.child.attack.state.current).toBe(2); // Ironbeak Owl: 2/1
        expect(roleC.child.health.state.current).toBe(1);
        expect(handA.refer.queue.length).toBe(1); // Ironbeak Owl in hand
        expect(boardA.refer.queue.length).toBe(1); // Ancient Watcher on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Check that Ancient Watcher has the restriction (cannot attack)
        expect(roleD.child.action.status).toBe(false); // Ancient Watcher cannot attack
        expect(roleD.child.action.state.isLock).toBe(true);

        // Play Ironbeak Owl
        let promise = cardC.play();
        SelectUtil.set(0); // Select position 0
        await AnimeUtil.sleep();
        // Choose target for battlecry (silence Ancient Watcher)
        expect(SelectUtil.current?.options).toContain(roleD); // Can target Ancient Watcher
        expect(SelectUtil.current?.options).not.toContain(roleA); // Cannot target heroes
        expect(SelectUtil.current?.options).not.toContain(roleB); // Cannot target heroes
        SelectUtil.set(roleD); // Target Ancient Watcher for silence
        await promise;

        // Ironbeak Owl should be on board
        expect(boardA.refer.queue.length).toBe(2); // Ironbeak Owl + Ancient Watcher on board
        expect(handA.refer.queue.length).toBe(0); // Ironbeak Owl moved to board
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 = 7

        // Ancient Watcher should be silenced (can now attack)
        expect(roleD.child.action.state.isLock).toBe(false);
        expect(roleD.child.action.status).toBe(true); // Ancient Watcher can now attack
    });

    test('ancient-watcher-attack', async () => {
        // Check initial state
        expect(roleD.child.health.state.current).toBe(5); // Ancient Watcher: 4/5
        expect(roleB.child.health.state.current).toBe(30); // Player B hero: 30 health
        expect(boardA.refer.queue.length).toBe(2); // Ironbeak Owl + Ancient Watcher on board

        // Ancient Watcher attacks Player B's hero
        let promise = roleD.child.action.run();
        expect(SelectUtil.current?.options).toContain(roleB); // Can target Player B's hero
        SelectUtil.set(roleB); // Target Player B's hero
        await promise;

        // Player B's hero should take 4 damage
        expect(roleB.child.health.state.current).toBe(26); // Player B hero: 30 - 4 = 26
        expect(roleD.child.health.state.current).toBe(5); // Ancient Watcher: 4/5 (no damage)
    });
});
