/**
 * Test cases for Ironbeak Owl
 * 
 * Initial state: Player A has Ironbeak Owl in hand.
 * Player A has an Ancient Watcher on board.
 * 
 * 1. ironbeak-owl-play: Player A plays Ironbeak Owl, silencing Ancient Watcher.
 * 2. ancient-watcher-attack: Ancient Watcher can now attack (silence removed the restriction).
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, AnimeUtil } from "hearthstone-core";
import { IronbeakOwlModel } from "./index";
import { AncientWatcherModel } from "../ancient-watcher";
import { boot } from '../../../src/boot';

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
                            cards: [new AncientWatcherModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new IronbeakOwlModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { cards: [] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: []
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: []
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
    const cardC = handA.child.cards.find(item => item instanceof IronbeakOwlModel);
    const cardD = boardA.child.cards.find(item => item instanceof AncientWatcherModel);
    if (!cardC || !cardD) throw new Error();
    const heroB = playerB.child.hero;

    test('ironbeak-owl-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(2); // Ironbeak Owl: 2/1
        expect(cardC.child.health.state.current).toBe(1);
        expect(handA.child.cards.length).toBe(1); // Ironbeak Owl in hand
        expect(boardA.child.cards.length).toBe(1); // Ancient Watcher on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Check that Ancient Watcher has the restriction (cannot attack)
        expect(cardD.child.action.status).toBe(false); // Ancient Watcher cannot attack

        // Play Ironbeak Owl
        let promise = cardC.play();
        playerA.controller.set(0); // Select position 0
        await AnimeUtil.pause();
        // Choose target for battlecry (silence Ancient Watcher)
        expect(playerA.controller.current?.options).toContain(cardD); // Can target Ancient Watcher
        playerA.controller.set(cardD); // Target Ancient Watcher for silence
        await promise;

        // Ironbeak Owl should be on board
        expect(boardA.child.cards.length).toBe(2); // Ironbeak Owl + Ancient Watcher on board
        expect(handA.child.cards.length).toBe(0); // Ironbeak Owl moved to board
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 = 7

        // Ancient Watcher should be silenced (can now attack)
        expect(cardD.child.action.status).toBe(true); // Ancient Watcher can now attack
    });

    test('ancient-watcher-attack', async () => {
        // Check initial state
        expect(cardD.child.health.state.current).toBe(5); // Ancient Watcher: 4/5
        expect(heroB.child.health.state.current).toBe(30); // Player B hero: 30 health
        expect(boardA.child.cards.length).toBe(2); // Ironbeak Owl + Ancient Watcher on board

        // Ancient Watcher attacks Player B's hero
        let promise = cardD.child.action.run();
        expect(playerA.controller.current?.options).toContain(heroB); // Can target Player B's hero
        playerA.controller.set(heroB); // Target Player B's hero
        await promise;

        // Player B's hero should take 4 damage
        expect(heroB.child.health.state.current).toBe(26); // Player B hero: 30 - 4 = 26
        expect(cardD.child.health.state.current).toBe(5); // Ancient Watcher: 4/5 (no damage)
    });
});
