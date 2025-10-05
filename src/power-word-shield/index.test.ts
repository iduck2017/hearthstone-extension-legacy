/**
 * Test cases for Power Word: Shield
 * 
 * Initial state: Player A has Power Word: Shield in hand and 3 Wisps in deck.
 * Player B has Stonetusk Boar on board.
 * 
 * 1. power-word-shield-cast: Player A uses Power Word: Shield on Stonetusk Boar, gives it +2 Health and draws a card.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil } from "hearthstone-core";
import { PowerWordShieldModel } from "./index";
import { StonetuskBoarModel } from "../stonetusk-boar";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('power-word-shield', () => {
    const game = new GameModel(() => ({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [] }
                    })),
                    hand: new HandModel(() => ({
                        child: { 
                            minions: [],
                            spells: [new PowerWordShieldModel()]
                        }
                    })),
                    deck: new DeckModel(() => ({
                        child: { 
                            minions: [new WispModel(), new WispModel(), new WispModel()]
                        }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { 
                            minions: [new StonetuskBoarModel()]
                        }
                    })),
                    hand: new HandModel(() => ({
                        child: { spells: [] }
                    }))
                }
            }))
        }
    }));
    boot(game);

    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    const deckA = playerA.child.deck;
    const cardC = handA.child.spells.find(item => item instanceof PowerWordShieldModel);
    const cardD = boardB.child.minions.find(item => item instanceof StonetuskBoarModel);
    const roleD = cardD?.child.role;
    if (!cardC || !roleD) throw new Error();

    test('power-word-shield-cast', async () => {
        // Check initial stats
        expect(roleD.child.attack.state.current).toBe(1); // Stonetusk Boar: 1/1
        expect(roleD.child.health.state.current).toBe(1);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.refer.order.length).toBe(1);
        expect(deckA.refer.order.length).toBe(3);

        // Player A uses Power Word: Shield on Stonetusk Boar
        const promise = cardC.play();
        expect(SelectUtil.current?.options).toContain(roleD);
        SelectUtil.set(roleD);
        await promise;

        // Stonetusk Boar should gain +2 Health
        expect(roleD.child.attack.state.current).toBe(1); // Attack unchanged
        expect(roleD.child.health.state.current).toBe(3); // 1 + 2 Health buff

        // Check that the buff was applied
        expect(roleD.child.buffs.length).toBe(1); // Should have the +2 Health buff

        // Player A should have drawn a card
        expect(handA.refer.order.length).toBe(1); // Power Word: Shield consumed, 1 card drawn
        expect(deckA.refer.order.length).toBe(2); // 3 - 1 = 2 (1 card drawn from deck)

        expect(playerA.child.mana.state.current).toBe(9); // 10 - 1 cost
    });
});
