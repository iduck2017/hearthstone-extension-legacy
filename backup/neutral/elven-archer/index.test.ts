/**
 * Test cases for Elven Archer
 * 
 * 1. elven-archer-battlecry: Player A plays Elven Archer and use battlecry, Player B's Wisp dies.
 */
import { BoardModel, DamageModel, GameModel, HandModel, MageModel, ManaModel, PlayerModel, AnimeUtil } from "hearthstone-core";
import { boot } from '../../boot';
import { ElvenArcherModel } from ".";
import { WispModel } from '../../neutral/wisp';

describe('battlecry', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    hand: new HandModel({
                        child: { 
                            cards: [new ElvenArcherModel()] 
                        }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new WispModel()] }
                    }),
                }
            }),
        }
    });
    const root = boot(game);
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const hand = game.child.playerA.child.hand;
    const board = game.child.playerB.child.board;
    const cardC = hand.child.cards.find(item => item instanceof ElvenArcherModel);
    const cardD = board.child.cards.find(item => item instanceof WispModel);
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;
    if (!cardC || !cardD) throw new Error();

    test('elven-archer-battlecry', async () => {
        expect(cardD.child.health.state.current).toBe(1);

        // play elven archer
        const promise = cardC.play();
        expect(playerA.child.controller.current?.options).toContain(0);
        playerA.child.controller.set(0);
        await AnimeUtil.sleep();
        const selector = playerA.child.controller.current;
        expect(selector?.options).toContain(cardD);
        expect(selector?.options).toContain(heroA);
        expect(selector?.options).toContain(heroB);
        playerA.child.controller.set(cardD);
        await promise;

        expect(cardD.child.health.state.current).toBe(0);
        expect(cardD.child.health.state.damage).toBe(1);
        expect(cardD.child.health.state.maximum).toBe(1);
        expect(cardD.child.health.state.current).toBe(0);
        expect(cardD.child.health.state.maximum).toBe(1);
        expect(cardD.child.dispose.status).toBe(true);

        const source = cardD.child.dispose.refer.source;
        expect(source).toBe(cardC);
    })
})
