/**
 * Test cases for Fireball
 * 
 * 1. fireball-damage: Player A plays Fireball and deals 6 damage to Player B's hero
 * 2. fireball-minion: Player A plays Fireball and deals 6 damage to a minion
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel } from "hearthstone-core";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";

import { CounterspellModel } from ".";
import { FireballModel } from "../../mage/fireball";


describe('fireball', () => {
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
                        child: { cards: [new CounterspellModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new WispModel()] }
                    }),
                    hand: new HandModel({
                        child: { cards: [new FireballModel()] }
                    })
                }
            })
        }
    });
    boot(game);
    
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const handA = playerA.child.hand;
    const handB = playerB.child.hand;
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;
    const spellC = handA.child.cards.find(item => item instanceof CounterspellModel);
    const spellD = handB.child.cards.find(item => item instanceof FireballModel);
    if (!spellC || !spellD) throw new Error();
    const boardA = game.child.playerA.child.board;
    const turn = game.child.turn;

    test('counterspell-cast', async () => {
        expect(boardA.child.secrets.length).toBe(0);
        await spellC.play();
        expect(boardA.child.secrets.length).toBe(1);
    })

    test('counterspell-trigger', async () => {
        turn.next();
        let promise = spellD.play();
        const options = playerB.child.controller.current?.options;
        expect(options).toContain(heroA);
        expect(options).toContain(heroB);
        playerB.child.controller.set(heroA);
        await promise;
        expect(handB.child.cards.length).toBe(0);
        expect(playerB.child.mana.state.current).toBe(6);
        expect(heroA.child.health.state.current).toBe(30);
        expect(boardA.child.secrets.length).toBe(0);
    })

})
