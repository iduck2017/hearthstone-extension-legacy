
/*
 * Test scenarios for Amani Berserker:
 * Initial: Player A has Berserker on board and woodoo in hand, Player B has 2 wisps on board
 * 1. Player A uses Berserker to attack wisp, wisp dies with health -1, Berserker gains attack power, health 2
 * 2. Player B uses second wisp to attack Berserker, wisp dies with health -4, Berserker health 1
 * 3. Player A plays woodoo to heal Berserker, Berserker loses attack power gain
 */

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, AnimeUtil, ManaModel } from "hearthstone-core";
import { AmaniBerserkerModel } from ".";
import { StonetuskBoarModel } from "../stonetusk-boar";
import { VoodooDoctorModel } from "../voodoo-doctor";
import { WispModel } from '../../neutral/wisp';
import { boot } from '../../boot';

describe('amani-berserker', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new AmaniBerserkerModel()] }
                    }),
                    hand: new HandModel({
                        child: { cards: [new VoodooDoctorModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [
                            new WispModel(),
                            new StonetuskBoarModel()
                        ]}
                    })
                }
            }),
        }
    });
    const root = boot(game);
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const handB = game.child.playerB.child.hand;
    const turn = game.child.turn;
    const cardC = boardA.child.cards.find((item: any) => item instanceof AmaniBerserkerModel);
    const cardD = boardB.child.cards.find((item: any) => item instanceof WispModel);
    const cardF = boardB.child.cards.find((item: any) => item instanceof StonetuskBoarModel);
    const cardE = handA.child.cards.find((item: any) => item instanceof VoodooDoctorModel);
    if (!cardC || !cardD || !cardE || !cardF) throw new Error();

    test('amani-berserker-attack', async () => {
        // Player A uses Berserker to attack wisp
        let promise = cardC.child.action.run();
        await AnimeUtil.sleep();
        expect(game.child.playerA.controller.current?.options).toContain(cardD);
        game.child.playerA.controller.set(cardD);
        await promise;
        
        // Verify wisp dies with health -1
        expect(cardD.child.health.state.current).toBe(-1);
        expect(cardD.child.dispose.status).toBe(true);
        expect(boardB.child.cards.length).toBe(1);
        
        // Verify Berserker gains attack power and has health 2
        expect(cardC.child.attack.state.current).toBe(5); // 2 base + 3 from enrage
        expect(cardC.child.attack.state.origin).toBe(2);
        expect(cardC.child.health.state.current).toBe(2);
        expect(cardC.child.health.state.damage).toBe(1);
    });

    test('stonetusk-boar-attack', async () => {
        turn.next();

        // Player B uses second wisp to attack Berserker
        let promise = cardF.child.action.run();
        await AnimeUtil.sleep();
        expect(game.child.playerB.controller.current?.options).toContain(cardC);
        game.child.playerB.controller.set(cardC); 
        await promise;
        
        // Verify wisp dies with health -4
        expect(cardF.child.health.state.current).toBe(-4);
        expect(cardF.child.dispose.status).toBe(true);
        expect(boardB.child.cards.length).toBe(0);
        
        // Verify Berserker has health 1 and maintains attack power
        expect(cardC.child.attack.state.current).toBe(5); // Still has +3 attack from being damaged
        expect(cardC.child.health.state.current).toBe(1);
        expect(cardC.child.health.state.damage).toBe(2);
    });

    test('voodoo-doctor-heal', async () => {
        turn.next(); 
        
        // Player A plays woodoo to heal Berserker
        let promise = cardE.play();
        await AnimeUtil.sleep();
        expect(game.child.playerA.controller.current?.options).toContain(0);
        game.child.playerA.controller.set(0);
        await AnimeUtil.sleep();
        expect(game.child.playerA.controller.current?.options).toContain(cardC);
        game.child.playerA.controller.set(cardC);
        await promise;
        
        // Verify Berserker is healed and loses attack power gain
        expect(cardC.child.attack.state.current).toBe(2); // Back to base attack
        expect(cardC.child.attack.state.origin).toBe(2);
        expect(cardC.child.health.state.current).toBe(3); // Fully healed
        expect(cardC.child.health.state.damage).toBe(0);
    });
}); 