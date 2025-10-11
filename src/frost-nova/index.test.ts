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
                        child: { minions: [] }
                    }),
                    hand: new HandModel({
                        child: { spells: [new FrostNovaModel()] }
                    }),
                    deck: new DeckModel({
                        child: { 
                            minions: [] 
                        }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [new WispModel(), new GoldshireFootmanModel()] }
                    }),
                    hand: new HandModel({
                        child: { spells: [] }
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
    const cardC = handA.child.spells.find(item => item instanceof FrostNovaModel);
    const cardD = boardB.child.minions.find(item => item instanceof WispModel);
    const cardE = boardB.child.minions.find(item => item instanceof GoldshireFootmanModel);
    const roleD = cardD?.child.role;
    const roleE = cardE?.child.role;
    if (!cardC || !roleD || !roleE) throw new Error();

    test('frost-nova-cast', async () => {
        // Check initial stats
        expect(roleD.child.health.state.current).toBe(1); // Wisp: 1 health
        expect(roleE.child.health.state.current).toBe(2); // Goldshire Footman: 2 health
        expect(roleD.child.feats.child.frozen.state.isActive).toBe(false);
        expect(roleE.child.feats.child.frozen.state.isActive).toBe(false);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.spells.length).toBe(1);
        expect(boardB.child.minions.length).toBe(2);

        // Player A uses Frost Nova - no target selection needed
        await cardC.play();

        // All enemy minions should be frozen, but no damage dealt
        expect(roleD.child.health.state.current).toBe(1); // Wisp: no damage
        expect(roleE.child.health.state.current).toBe(2); // Goldshire Footman: no damage
        expect(roleD.child.feats.child.frozen.state.isActive).toBe(true);
        expect(roleE.child.feats.child.frozen.state.isActive).toBe(true);
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 cost
        expect(handA.child.spells.length).toBe(0);

        // All minions should remain on board (no damage, just frozen)
        expect(boardB.child.minions.length).toBe(2);
    })

    test('turn-next', async () => {
        const turn = game.child.turn;
        
        // Turn passes to Player B
        turn.next();
        expect(turn.refer.current).toBe(playerB);

        // Check that frozen minions cannot attack
        expect(roleD.child.action.status).toBe(false); // Wisp cannot attack
        expect(roleE.child.action.status).toBe(false); // Goldshire Footman cannot attack
        expect(roleD.child.feats.child.frozen.state.isActive).toBe(true);
        expect(roleE.child.feats.child.frozen.state.isActive).toBe(true);
    })
})
