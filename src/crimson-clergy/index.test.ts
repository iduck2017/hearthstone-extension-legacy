/**
 * Test cases for Crimson Clergy
 * 
 * Initial state: Player A has Crimson Clergy on board and Circle of Healing in hand.
 * 
 * 1. crimson-clergy-play: Player A plays Crimson Clergy on board.
 * 2. circle-of-healing-cast: Player A uses Circle of Healing on full health minion, triggers overheal, draws card.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel, SelectUtil } from "hearthstone-core";
import { CrimsonClergyModel } from "./index";
import { CircleOfHealingModel } from "../circle-of-healing";
import { WispModel } from "../wisp";
import { boot } from "../boot";

describe('crimson-clergy', () => {
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
                            minions: [new CrimsonClergyModel()],
                            spells: [new CircleOfHealingModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { 
                            minions: [new WispModel(), new WispModel(), new WispModel()]
                        }
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
                    })
                }
            })
        }
    });
    boot(game);

    const playerA = game.child.playerA;
    const boardA = playerA.child.board;
    const handA = playerA.child.hand;
    const deckA = playerA.child.deck;
    const cardC = handA.child.minions.find(item => item instanceof CrimsonClergyModel);
    const cardD = handA.child.spells.find(item => item instanceof CircleOfHealingModel);
    if (!cardC || !cardD) throw new Error();
    const roleC = cardC.child.role;

    test('crimson-clergy-play', async () => {
        // Check initial state
        expect(playerA.child.mana.state.current).toBe(10);
        expect(boardA.child.minions.length).toBe(0);
        expect(handA.child.minions.length).toBe(1);

        // Player A plays Crimson Clergy
        const promise = cardC.play();
        SelectUtil.set(0);
        await promise;

        // Check that Crimson Clergy is on board
        expect(boardA.child.minions.length).toBe(1);
        expect(roleC.child.attack.state.current).toBe(1); // Crimson Clergy: 1/3
        expect(roleC.child.health.state.current).toBe(3);
        expect(playerA.child.mana.state.current).toBe(9); // 10 - 1 cost
        expect(handA.child.minions.length).toBe(0); // Clergy consumed
    });

    test('circle-of-healing-cast', async () => {
        // Check initial hand and deck size
        console.log(handA.refer.queue.map(item => item.name));
        expect(handA.refer.queue.length).toBe(1); // Only Circle of Healing
        expect(deckA.refer.queue.length).toBe(3); // 3 Wisps

        // Player A uses Circle of Healing on full health minions
        const promise = cardD.play();
        await promise;

        // Player A should have drawn cards due to overheal (all minions were at full health)
        console.log(handA.refer.queue.map(item => item.name))
        expect(handA.refer.queue.length).toBe(1); 
        expect(deckA.refer.queue.length).toBe(2); // 3 - 1 = 2 (1 card drawn from deck)
        expect(playerA.child.mana.state.current).toBe(9); // 9 - 0 cost
    });
});
