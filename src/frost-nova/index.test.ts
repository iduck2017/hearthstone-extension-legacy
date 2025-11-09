/**
 * Test cases for Frost Nova
 * 
 * 1. frost-nova-cast: Player A uses Frost Nova to freeze all enemy minions
 * 2. turn-next: After turn passes, frozen minions cannot attack
 */

import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { FrostNovaModel } from "./index";
import { WispModel } from "../wisp";
import { GoldshireFootmanModel } from "../goldshire-footman";
import { boot } from "../boot";

describe('frost-nova', () => {
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
                        child: { cards: [new FrostNovaModel()] }
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
                        child: { cards: [new WispModel(), new GoldshireFootmanModel()] }
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
    const cardC = handA.child.cards.find(item => item instanceof FrostNovaModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    const cardE = boardB.child.cards.find(item => item instanceof GoldshireFootmanModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    test('frost-nova-cast', async () => {
        // Check initial stats
        expect(cardD.child.health.state.current).toBe(1); // Wisp: 1 health
        expect(cardE.child.health.state.current).toBe(2); // Goldshire Footman: 2 health
        expect(cardD.child.feats.child.frozen.state.isActive).toBe(false);
        expect(cardE.child.feats.child.frozen.state.isActive).toBe(false);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(1);
        expect(boardB.child.cards.length).toBe(2);

        // Player A uses Frost Nova - no target selection needed
        await cardC.play();

        // All enemy minions should be frozen, but no damage dealt
        expect(cardD.child.health.state.current).toBe(1); // Wisp: no damage
        expect(cardE.child.health.state.current).toBe(2); // Goldshire Footman: no damage
        expect(cardD.child.feats.child.frozen.state.isActive).toBe(true);
        expect(cardE.child.feats.child.frozen.state.isActive).toBe(true);
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 cost
        expect(handA.child.cards.length).toBe(0);

        // All minions should remain on board (no damage, just frozen)
        expect(boardB.child.cards.length).toBe(2);
    })

    test('turn-next', async () => {
        const turn = game.child.turn;
        
        // Turn passes to Player B
        turn.next();
        expect(turn.refer.current).toBe(playerB);

        // Check that frozen minions cannot attack
        expect(cardD.child.action.status).toBe(false); // Wisp cannot attack
        expect(cardE.child.action.status).toBe(false); // Goldshire Footman cannot attack
        expect(cardD.child.feats.child.frozen.state.isActive).toBe(true);
        expect(cardE.child.feats.child.frozen.state.isActive).toBe(true);
    })
})
