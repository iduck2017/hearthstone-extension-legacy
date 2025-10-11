/**
 * Test cases for Psychic Conjurer
 * 
 * Initial state: Player A has Psychic Conjurer in hand.
 * Player B has 1 Wisp in deck.
 * 
 * 1. psychic-conjurer-play: Player A plays Psychic Conjurer, copies a random card from Player B's deck.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil } from "hearthstone-core";
import { PsychicConjurerModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('psychic-conjurer', () => {
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
                        child: { 
                            minions: [new PsychicConjurerModel()],
                            spells: []
                        }
                    }),
                    deck: new DeckModel({
                        child: { minions: [] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { minions: [] }
                    }),
                    hand: new HandModel({
                        child: { spells: [] }
                    }),
                    deck: new DeckModel({
                        child: { 
                            minions: [new WispModel()]
                        }
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
    const deckB = playerB.child.deck;
    const cardC = handA.child.minions.find(item => item instanceof PsychicConjurerModel);
    const cardE = deckB.child.minions.find(item => item instanceof WispModel);
    if (!cardC) throw new Error();
    const roleC = cardC.child.role;

    test('psychic-conjurer-play', async () => {
        // Check initial state
        expect(playerA.child.mana.state.current).toBe(10);
        expect(boardA.child.minions.length).toBe(0);
        expect(handA.refer.queue.length).toBe(1);
        expect(deckB.refer.queue.length).toBe(1);

        // Player A plays Psychic Conjurer
        const promise = cardC.play();
        SelectUtil.set(0);
        await promise;

        // Check that Psychic Conjurer is on board
        expect(boardA.child.minions.length).toBe(1);
        expect(playerA.child.mana.state.current).toBe(9); // 10 - 1 cost
        expect(roleC.child.attack.state.current).toBe(1); // Psychic Conjurer: 1/2
        expect(roleC.child.health.state.current).toBe(2);

        const cardD = handA.child.minions.find(item => item instanceof WispModel);
        if (!cardD) throw new Error();
        expect(cardD).toBeDefined();
        
        // Check that the copied Wisp has the correct creator
        expect(cardD.refer.creator).toBe(cardE);

        // Player A should have copied a card from Player B's deck
        expect(handA.refer.queue.length).toBe(1); // Psychic Conjurer consumed, 1 card copied
        // Player B's deck should be unchanged
        expect(deckB.child.minions.length).toBe(1); // Original deck unchanged

    });
});
