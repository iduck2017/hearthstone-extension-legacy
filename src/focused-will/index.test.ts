/**
 * Test cases for Focused Will
 * 
 * Initial state: Player A has Stonetusk Boar and Focused Will in hand.
 * 
 * 1. stonetusk-boar-play: Player A plays Stonetusk Boar, checks it can attack, health 1
 * 2. focused-will-cast: Player A uses Focused Will on Boar, Boar cannot attack (charge silenced), health 4
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel } from "hearthstone-core";
import { FocusedWillModel } from "./index";
import { StonetuskBoarModel } from "../stonetusk-boar";
import { boot } from "../boot";

describe('focused-will', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new StonetuskBoarModel(), new FocusedWillModel()]
                        }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { cards: [] }
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
    const cardC = handA.child.cards.find(item => item instanceof StonetuskBoarModel);
    const cardD = handA.child.cards.find(item => item instanceof FocusedWillModel);
    if (!cardC || !cardD) throw new Error();


    test('stonetusk-boar-play', async () => {
        // Check initial state
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(2);
        expect(boardA.child.cards.length).toBe(0);

        // Player A plays Stonetusk Boar
        const promise = cardC.play();
        playerA.child.controller.set(0);
        await promise;

        expect(cardC.child.attack.state.current).toBe(1); // Stonetusk Boar: 1/1
        expect(cardC.child.health.state.current).toBe(1);
        expect(cardC.child.action.status).toBe(true); // Can attack (charge)
        expect(playerA.child.mana.state.current).toBe(9); // 10 - 1 cost
        expect(handA.child.cards.length).toBe(1); // Boar consumed
    });

    test('focused-will-cast', async () => {
        // Player A uses Focused Will on Boar
        const promise = cardD.play();
        expect(playerA.child.controller.current?.options).toContain(cardC);
        playerA.child.controller.set(cardC);
        await promise;

        // Boar should be silenced (cannot attack) and gain +3 Health
        expect(cardC.child.attack.state.current).toBe(1); // Attack unchanged
        expect(cardC.child.health.state.current).toBe(4); // 1 + 3 Health buff
        expect(cardC.child.action.status).toBe(false); // Cannot attack (charge silenced)
        expect(playerA.child.mana.state.current).toBe(8); // 9 - 1 cost
        expect(handA.child.cards.length).toBe(0); // Focused Will consumed
        expect(boardA.child.cards.length).toBe(1); // Minion still on board
    });
});
