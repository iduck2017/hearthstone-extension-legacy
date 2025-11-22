/**
 * Test cases for Power Word: Shield
 * 
 * Initial state: Player A has Power Word: Shield in hand and 3 Wisps in deck.
 * Player B has Stonetusk Boar on board.
 * 
 * 1. power-word-shield-cast: Player A uses Power Word: Shield on Stonetusk Boar, gives it +2 Health and draws a card.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { PowerWordShieldModel } from "./index";
import { StonetuskBoarModel } from "../../neutral/stonetusk-boar";
import { WispModel } from "../../neutral/wisp";
import { boot } from "../../boot";

describe('power-word-shield', () => {
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
                            cards: [new PowerWordShieldModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { 
                            cards: [new WispModel(), new WispModel(), new WispModel()]
                        }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new StonetuskBoarModel()]
                        }
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
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    const deckA = playerA.child.deck;
    const cardC = handA.child.cards.find(item => item instanceof PowerWordShieldModel);
    const cardD = boardB.child.cards.find(item => item instanceof StonetuskBoarModel);
    if (!cardC || !cardD) throw new Error();

    test('power-word-shield-cast', async () => {
        // Check initial stats
        expect(cardD.child.attack.state.current).toBe(1); // Stonetusk Boar: 1/1
        expect(cardD.child.health.state.current).toBe(1);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(1);
        expect(deckA.child.cards.length).toBe(3);

        // Player A uses Power Word: Shield on Stonetusk Boar
        const promise = cardC.play();
        expect(playerA.controller.current?.options).toContain(cardD);
        playerA.controller.set(cardD);
        await promise;

        // Stonetusk Boar should gain +2 Health
        expect(cardD.child.attack.state.current).toBe(1); // Attack unchanged
        expect(cardD.child.health.state.current).toBe(3); // 1 + 2 Health buff

        
        // Player A should have drawn a card
        expect(handA.child.cards.length).toBe(1); // Power Word: Shield consumed, 1 card drawn
        expect(deckA.child.cards.length).toBe(2); // 3 - 1 = 2 (1 card drawn from deck)

        expect(playerA.child.mana.state.current).toBe(9); // 10 - 1 cost
    });
});
