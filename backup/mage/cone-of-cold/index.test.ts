/**
 * Test cases for Cone of Cold
 * 
 * 1. cone-of-cold-cast: Player A uses Cone of Cold on Player B's minions, Wisp dies and Footman takes damage
 * 2. turn-next: After turn passes, frozen Footman cannot attack
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { ConeOfColdModel } from "./index";
import { WispModel } from "../../neutral/wisp";
import { GoldshireFootmanModel } from "../../neutral/goldshire-footman";
import { boot } from "../../boot";
import { ManaWyrmModel } from "../../mage/mana-wyrm";

describe('cone-of-cold', () => {
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
                        child: { cards: [new ConeOfColdModel()] }
                    }),
                    deck: new DeckModel({
                        child: { 
                            cards: [] 
                        }
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
                            new GoldshireFootmanModel(), 
                            new ManaWyrmModel()
                        ] }
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
    const handA = playerA.child.hand;
    const boardB = playerB.child.board;
    const cardC = handA.child.cards.find(item => item instanceof ConeOfColdModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    const cardE = boardB.child.cards.find(item => item instanceof GoldshireFootmanModel);
    const cardF = boardB.child.cards.find(item => item instanceof ManaWyrmModel);
    if (!cardC || !cardD || !cardE || !cardF) throw new Error();
    const heroB = playerB.child.hero;

    test('cone-of-cold-cast', async () => {
        // Check initial stats
        expect(cardD.child.health.state.current).toBe(1); // Wisp: 1 health
        expect(cardE.child.health.state.current).toBe(2); // Goldshire Footman: 2 health
        expect(cardD.child.frozen.state.actived).toBe(false);
        expect(cardE.child.frozen.state.actived).toBe(false);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(1);
        expect(boardB.child.cards.length).toBe(3);

        // Player A uses Cone of Cold on Player B's Wisp (leftmost minion)
        const promise = cardC.play();
        const options = playerA.controller.current?.options;
        expect(options).toContain(cardD);
        expect(options).toContain(cardE);
        expect(options).not.toContain(heroB);
        // choose Wisp
        playerA.controller.set(cardD);
        await promise;

        // Wisp should die (1 - 1 = 0), Footman should take 1 damage (2 - 1 = 1)
        expect(cardD.child.health.state.current).toBe(0); // Wisp dies
        expect(cardD.child.dispose.status).toBe(true); // Wisp dies
        expect(cardD.child.frozen.state.actived).toBe(true);

        expect(cardE.child.health.state.current).toBe(1); // Footman: 2 - 1 = 1
        expect(cardE.child.frozen.state.actived).toBe(true);

        expect(cardF.child.health.state.current).toBe(3); // Mana Wyrm: 3
        expect(cardF.child.frozen.state.actived).toBe(false);
        
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 cost
        expect(handA.child.cards.length).toBe(0);

        // Dead Wisp should be removed from board, Footman remains
        expect(boardB.child.cards.length).toBe(2);
    })

    test('turn-next', async () => {
        const turn = game.child.turn;
        
        // Turn passes to Player B
        turn.next();
        expect(turn.refer.current).toBe(playerB);

        // Check that frozen Footman cannot attack
        expect(cardE.child.action.status).toBe(false); // Goldshire Footman cannot attack
        expect(cardE.child.frozen.state.actived).toBe(true);

        expect(cardF.child.action.status).toBe(true); // Mana Wyrm can attack
        expect(cardF.child.frozen.state.actived).toBe(false);
    })
})
