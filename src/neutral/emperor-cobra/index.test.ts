/**
 * Test cases for Emperor Cobra
 * 
 * Initial state: Player A has Emperor Cobra in hand.
 * Player B has a Mogu'shan Warden on board.
 * 
 * 1. emperor-cobra-play: Player A plays Emperor Cobra.
 * 2. poisonous-test: Emperor Cobra attacks Player B's Mogu'shan Warden, killing it with Poisonous.
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, DeckModel } from "hearthstone-core";
import { EmperorCobraModel } from "./index";
import { MogushanWardenModel } from "../mogushan-warden";
import { boot } from '../../boot';

describe('emperor-cobra', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: []
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new EmperorCobraModel()]
                        }
                    }),
                    deck: new DeckModel({
                        child: { cards: [] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            cards: [new MogushanWardenModel()]
                        }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: []
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
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    const cardC = handA.child.cards.find(item => item instanceof EmperorCobraModel);
    const cardD = boardB.child.cards.find(item => item instanceof MogushanWardenModel);
    if (!cardC || !cardD) throw new Error();
    const heroA = playerA.child.hero;

    test('emperor-cobra-play', async () => {
        // Check initial state
        expect(cardC.child.attack.state.current).toBe(2); // Emperor Cobra: 2/3
        expect(cardC.child.health.state.current).toBe(3);
        expect(handA.child.cards.length).toBe(1); // Emperor Cobra in hand
        expect(boardA.child.cards.length).toBe(0); // No minions on board
        expect(playerA.child.mana.state.current).toBe(10); // Full mana

        // Play Emperor Cobra
        let promise = cardC.play();
        playerA.child.controller.set(0); // Select position 0
        await promise;

        // Emperor Cobra should be on board
        expect(boardA.child.cards.length).toBe(1); // Emperor Cobra on board
        expect(handA.child.cards.length).toBe(0); // Emperor Cobra moved to board
        expect(playerA.child.mana.state.current).toBe(7); // 10 - 3 = 7

        // Check that Emperor Cobra has Poisonous
        expect(cardC.child.poisonous.state.actived).toBe(true); // Has Poisonous
    });

    test('mogushan-attacks-cobra', async () => {
        // Turn to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        // Check initial state
        expect(cardC.child.health.state.current).toBe(3); // Emperor Cobra: 2/3
        expect(cardD.child.health.state.current).toBe(7); // Mogu'shan Warden: 1/7
        expect(boardA.child.cards.length).toBe(1); // Emperor Cobra on board
        expect(boardB.child.cards.length).toBe(1); // Mogu'shan Warden on board

        // Mogu'shan Warden attacks Emperor Cobra - should die from Poisonous despite high health
        let promise = cardD.child.action.start();
        expect(playerB.child.controller.current?.options).toContain(cardC); // Can target Emperor Cobra
        expect(playerB.child.controller.current?.options).toContain(heroA); // Can target Player A's hero
        playerB.child.controller.set(cardC); // Target Emperor Cobra
        await promise;

        // Mogu'shan Warden should die from Poisonous (despite having 7 health vs 2 attack)
        expect(cardD.child.health.state.current).toBe(5); // Mogu'shan Warden dies from Poisonous
        expect(cardD.child.health.state.damage).toBe(2);
        expect(cardD.child.dispose.status).toBe(true);
        expect(cardD.child.dispose.refer.source).toBe(cardC);
        expect(cardD.child.dispose.state.destroyed).toBe(true);
        
        expect(boardB.child.cards.length).toBe(0); // Mogu'shan Warden dies
        // Emperor Cobra should also take damage from the attack
        expect(cardC.child.health.state.current).toBe(2); // Emperor Cobra: 3 - 1 = 2
    });
});
