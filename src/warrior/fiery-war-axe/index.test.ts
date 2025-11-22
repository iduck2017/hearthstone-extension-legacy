import { BoardModel, GameModel, HandModel, MageModel, ManaModel, PlayerModel, WarriorModel } from "hearthstone-core";
import { WispModel } from "../../neutral/wisp";
import { FieryWarAxeModel } from ".";
import { DebugUtil } from "set-piece";
import { boot } from "../../boot";

describe('firey-war-axe', () => {
    const game = boot(new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new WarriorModel(),
                    hand: new HandModel({
                        child: { cards: [new FieryWarAxeModel()] }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { cards: [new WispModel()] }
                    }),
                }
            }),
        }
    }));
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const heroA = playerA.child.hero;
    const handA = playerA.child.hand;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const cardC = boardB.child.cards.find(item => item instanceof WispModel);
    if (!cardC) throw new Error();
    const turn = game.child.turn;

    const weapon = handA.child.cards.find(item => item instanceof FieryWarAxeModel);
    expect(weapon).toBeDefined();
    if (!weapon) throw new Error();

    test('fiery-war-axe-equip', async () => {
        expect(heroA.child.attack.state.current).toBe(0);
        expect(handA.child.cards.length).toBe(1);
        expect(heroA.child.weapon).toBeUndefined();
        
        await weapon.play();
        expect(handA.child.cards.length).toBe(0);
        expect(heroA.child.weapon).toBeDefined();
        expect(heroA.child.attack.state.current).toBe(3);

        expect(weapon?.child.attack.state.current).toBe(3);
        expect(heroA.child.attack.state.current).toBe(3);
    })


    // test('warrior-attack', async () => {
    //     const promise = charA.child.action.run();
    //     expect(playerA.controller.current).toBeDefined();
    //     expect(playerA.controller.current?.options).toContain(cardC);
    //     expect(playerA.controller.current?.options).toContain(charB);
    //     playerA.controller.set(cardC);
    //     await promise;

    //     expect(cardC.child.dispose.state.isActived).toBe(true);
    //     expect(cardC.child.health.state.current).toBe(-2);
    //     expect(cardC.child.health.state.damage).toBe(3);

    //     expect(charA.child.health.state.current).toBe(29);
    //     expect(charA.child.health.state.damage).toBe(1);

    //     expect(weapon.child.action.state.current).toBe(1);
    //     expect(weapon.child.action.state.consume).toBe(1);
    //     expect(weapon.child.action.state.origin).toBe(2);

    //     expect(boardB.child.cards.length).toBe(0);
    // })

    // test('fiery-war-axe-deactive', () => {
    //     expect(weapon.child.attack.state.isReady).toBe(true);
    //     expect(charA.child.attack.state.current).toBe(3);
    //     turn.next();
    //     expect(turn.refer.current).toBe(playerB);
    //     expect(weapon.child.attack.state.isReady).toBe(false);
    //     expect(charA.child.attack.state.current).toBe(0);
    // }) 

    // test('warrior-attack', async () => {
    //     turn.next();
    //     expect(weapon.child.attack.state.isReady).toBe(true);
    //     expect(charA.child.action.state.isReady).toBe(true);

    //     const promise = charA.child.action.run();
    //     expect(playerA.controller.current).toBeDefined();
    //     expect(playerA.controller.current?.options).toContain(charB);
    //     playerA.controller.set(charB);
    //     await promise;

    //     expect(charB.child.health.state.current).toBe(27);
    //     expect(charB.child.health.state.damage).toBe(3);

    //     expect(weapon.child.dispose.state.isActived).toBe(true);
    //     expect(weapon.child.action.state.current).toBe(0);
    //     expect(heroA.child.weapon).toBeUndefined();
        
    //     expect(charA.child.attack.state.current).toBe(0);
    // })
})