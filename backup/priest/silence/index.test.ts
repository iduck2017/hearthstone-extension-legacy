/**
 * Test cases for Silence
 * 
 * Initial state: Player A has Mana Wyrm on board, Ice Lance and Silence in hand.
 * 
 * 1. ice-lance-cast: Player A uses Ice Lance on Mana Wyrm, Mana Wyrm gains +1 attack and is frozen
 * 2. silence-cast: Player A uses Silence on Mana Wyrm, Mana Wyrm returns to 1/3 and is no longer frozen
 * 3. mana-wyrm-attack: Mana Wyrm attacks Player B, Player B loses 1 health
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel } from "hearthstone-core";
import { SilenceModel } from "./index";
import { ManaWyrmModel } from "../../mage/mana-wyrm";
import { IceLanceModel } from "../../mage/ice-lance";
import { boot } from "../../boot";

describe('silence', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new ManaWyrmModel()] }
                    }),
                    hand: new HandModel({
                        child: { cards: [new IceLanceModel(), new SilenceModel()] }
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
    const heroB = playerB.child.hero;
    const cardC = boardA.child.cards.find(item => item instanceof ManaWyrmModel);
    const cardD = handA.child.cards.find(item => item instanceof IceLanceModel);
    const cardE = handA.child.cards.find(item => item instanceof SilenceModel);
    if (!cardC || !cardD || !cardE) throw new Error();

    test('ice-lance-cast', async () => {
        // Check initial stats
        expect(cardC.child.attack.state.current).toBe(1); // Mana Wyrm: 1/3
        expect(cardC.child.health.state.current).toBe(3);
        expect(cardC.child.feats.child.frozen.state.isActive).toBe(false);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.cards.length).toBe(2);

        // Player A uses Ice Lance on Mana Wyrm
        const promise = cardD.play();
        expect(playerA.controller.current?.options).toContain(cardC);
        playerA.controller.set(cardC);
        await promise;

        // Mana Wyrm should gain +1 attack and be frozen
        expect(cardC.child.attack.state.current).toBe(2); // 1 + 1 from spell cast
        expect(cardC.child.health.state.current).toBe(3);
        expect(cardC.child.feats.child.frozen.state.isActive).toBe(true);
        expect(cardC.child.action.status).toBe(false);
        expect(playerA.child.mana.state.current).toBe(9); // 10 - 1 cost
        expect(handA.child.cards.length).toBe(1); // Ice Lance consumed
    });

    test('silence-cast', async () => {
        // Check stats after ice lance
        expect(cardC.child.attack.state.current).toBe(2);
        expect(cardC.child.health.state.current).toBe(3);
        expect(cardC.child.feats.child.frozen.state.isActive).toBe(true);

        // Player A uses Silence on Mana Wyrm
        const promise = cardE.play();
        expect(playerA.controller.current?.options).toContain(cardC);
        playerA.controller.set(cardC);
        await promise;

        // Mana Wyrm should return to original stats and be unfrozen
        expect(cardC.child.attack.state.current).toBe(1); // Back to original
        expect(cardC.child.health.state.current).toBe(3);
        expect(cardC.child.feats.child.frozen.state.isActive).toBe(false);
        expect(playerA.child.mana.state.current).toBe(9); // 9 - 0 cost
        expect(handA.child.cards.length).toBe(0); // Silence consumed
    });

    test('mana-wyrm-attack', async () => {
        // Check final stats
        expect(cardC.child.attack.state.current).toBe(1);
        expect(cardC.child.health.state.current).toBe(3);
        expect(heroB.child.health.state.current).toBe(30); // Player B hero health

        // Mana Wyrm attacks Player B hero
        const promise = cardC.child.action.run();
        expect(playerA.controller.current?.options).toContain(heroB);
        playerA.controller.set(heroB);
        await promise;

        // Player B should take 1 damage
        expect(heroB.child.health.state.current).toBe(29); // 30 - 1 damage
    });
});
