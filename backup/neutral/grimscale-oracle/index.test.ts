/**
 * Test cases for Grimscale Oracle
 * 
 * 1. grimscale-oracle-buff: Player A plays Grimscale Oracle, Player A's Murloc gains +1 Attack
 * 2. murloc-raider-attack: Player B's Murloc attacks Player A's Oracle, both die
 */
import { GameModel, PlayerModel, HandModel, BoardModel, MageModel, AnimeUtil, ManaModel } from "hearthstone-core";
import { GrimscaleOracleModel } from ".";
import { MurlocRaiderModel } from "../murloc-raider";
import { WispModel } from '../../neutral/wisp';
import { boot } from '../../boot';


describe('grimscale-oracle', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [
                            new MurlocRaiderModel(),
                            new WispModel()
                        ]}
                    }),
                    hand: new HandModel({
                        child: { cards: [new GrimscaleOracleModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new MurlocRaiderModel()] }
                    })
                }
            })
        }
    });
    const root = boot(game);
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const cardC = handA.child.cards.find((item: any) => item instanceof GrimscaleOracleModel);
    const cardD = boardA.child.cards.find((item: any) => item instanceof WispModel);
    const cardE = boardA.child.cards.find((item: any) => item instanceof MurlocRaiderModel);
    const cardF = boardB.child.cards.find((item: any) => item instanceof MurlocRaiderModel);
    if (!cardC || !cardD || !cardE || !cardF) throw new Error();
    const turn = game.child.turn;
    const heroA = game.child.playerA.child.hero;

    test('minions-initial-state', async () => {
        expect(cardE.child.attack.state.current).toBe(2);
        expect(cardF.child.attack.state.current).toBe(2);
        expect(cardD.child.attack.state.current).toBe(1);
    })

    test('grimscale-oracle-buff', async () => {
        const promise = cardC.play();
        await AnimeUtil.sleep();
        expect(game.child.playerA.controller.current).toBeDefined();
        expect(game.child.playerA.controller.current?.options.length).toBe(3);
        game.child.playerA.controller.set(0);
        await promise;

        expect(boardA.child.cards.length).toBe(3);
        expect(boardB.child.cards.length).toBe(1);

        expect(cardE.child.attack.state.current).toBe(3); // Ally's Murloc
        expect(cardE.child.attack.state.origin).toBe(2); // Original attack
        
        expect(cardF.child.attack.state.current).toBe(2); // Opponent's Murloc
        expect(cardD.child.attack.state.current).toBe(1); // Wisp 
        expect(cardC.child.attack.state.current).toBe(1); // Grimscale Oracle self
    })

    test('murloc-raider-attack-grimscale-oracle', async () => {
        turn.next();
        expect(game.child.turn.refer.current).toBe(game.child.playerB);
        expect(cardF.child.action.state.current).toBe(1);

        // Murloc Raider attacks Grimscale Oracle
        const promise = cardF.child.action.run();
        await AnimeUtil.sleep();
        expect(game.child.playerB.controller.current).toBeDefined();
        expect(game.child.playerB.controller.current?.options.length).toBe(4);
        expect(game.child.playerB.controller.current?.options).toContain(cardE);
        expect(game.child.playerB.controller.current?.options).toContain(cardC);
        expect(game.child.playerB.controller.current?.options).toContain(cardD);
        expect(game.child.playerB.controller.current?.options).toContain(heroA); 
        game.child.playerB.controller.set(cardC);
        await promise;

        expect(cardF.child.action.state.current).toBe(0); // Murloc Raider
        expect(cardF.child.health.state.current).toBe(0); // Murloc Raider
        expect(cardF.child.dispose.status).toBe(true); // Murloc Raider

        expect(cardC.child.health.state.current).toBe(-1); // Grimscale Oracle
        expect(cardC.child.dispose.status).toBe(true);

        expect(boardB.child.cards.length).toBe(0);
        expect(boardA.child.cards.length).toBe(2);

        expect(cardE.child.attack.state.current).toBe(2); // Ally's Murloc
        expect(cardD.child.attack.state.current).toBe(1); // Wisp
    })
}) 