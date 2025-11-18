
/*
 * Test scenarios for Ancient Watcher:
 * 1. ancient-watcher-cannot-attack: Player A plays Ancient Watcher, it cannot attack
 * 2. ancient-watcher-cannot-attack-2: Ancient Watcher still cannot attack after turn changes
 */
import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, AnimeUtil, ManaModel } from "hearthstone-core";
import { AncientWatcherModel } from ".";
import { WispModel } from '../../neutral/wisp';
import { boot } from '../../boot';

describe('ancient-watcher', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    hand: new HandModel({
                        child: { cards: [new AncientWatcherModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new WispModel()] }
                    })
                }
            })
        }
    });
    const root = boot(game);
    const handA = game.child.playerA.child.hand;
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const cardA = handA.child.cards.find((item: any) => item instanceof AncientWatcherModel);
    const cardB = boardB.child.cards.find((item: any) => item instanceof WispModel);
    if (!cardA || !cardB) throw new Error();

    test('ancient-watcher-cannot-attack', async () => {
        
        // Player A plays Watcher
        let promise = cardA.play();
        await AnimeUtil.sleep();
        expect(game.child.playerA.child.controller.current?.options).toContain(0);
        game.child.playerA.child.controller.set(0);
        await promise;
        
        expect(boardA.child.cards.length).toBe(1);
        expect(cardA.child.attack.state.current).toBe(4);
        expect(cardA.child.health.state.current).toBe(5);
        expect(cardA.child.action.state.current).toBe(1);
        
        // Verify Watcher cannot attack
        expect(cardA.child.action.status).toBe(false);
        
        // Try to attack and verify no options are available
        promise = cardA.child.action.run();
        await AnimeUtil.sleep();
        expect(game.child.playerA.child.controller.current).toBeUndefined();
        await promise;
    });

    test('ancient-watcher-cannot-attack-2', async () => {
        // End first turn
        const turn = game.child.turn;
        turn.next();
        
        // Verify Watcher still cannot attack after turn change
        expect(cardA.child.action.status).toBe(false);
        
        // End second turn
        turn.next();
        
        // Verify Watcher still cannot attack after second turn change
        expect(cardA.child.action.status).toBe(false);
    });
}); 