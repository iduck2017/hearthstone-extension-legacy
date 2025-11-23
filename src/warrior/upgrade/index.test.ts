/**
 * Test cases for Upgrade!
 * 
 * 1. initial-state:
 *    - Player A has Upgrade! in hand
 *    - Player A hero has no weapon
 *    - Player B has Upgrade! in hand
 *    - Player B hero has Fiery War Axe equipped
 * 2. upgrade-cast:
 *    - Player A casts Upgrade!
 *    - Assert: Player A hero has a 1/3 weapon equipped
 * 3. upgrade-cast:
 *    - Turn switches to Player B
 *    - Player B casts Upgrade!
 *    - Assert: Fiery War Axe attack becomes 4
 *    - Assert: Fiery War Axe durability becomes 3
 */
import { BoardModel, GameModel, HandModel, MageModel, ManaModel, PlayerModel, WarriorModel, DeckModel, CommonUtil } from "hearthstone-core";
import { UpgradeModel } from ".";
import { FieryWarAxeModel } from "../fiery-war-axe";
import { boot } from "../../boot";

describe('upgrade', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new WarriorModel(),
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new UpgradeModel()]
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
                    hero: new WarriorModel({
                        child: {
                            weapon: new FieryWarAxeModel()
                        }
                    }),
                    board: new BoardModel({
                        child: { cards: [] }
                    }),
                    hand: new HandModel({
                        child: { 
                            cards: [new UpgradeModel()]
                        }
                    }),
                    deck: new DeckModel({
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
    const handB = playerB.child.hand;
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;
    
    const cardC = handA.child.cards.find(item => item instanceof UpgradeModel);
    const cardD = handB.child.cards.find(item => item instanceof UpgradeModel);
    if (!cardC || !cardD) throw new Error();

    const weaponB = heroB.child.weapon;
    if (!weaponB || !(weaponB instanceof FieryWarAxeModel)) throw new Error();

    test('upgrade-cast', async () => {
        // Player A casts Upgrade!
        let promise = cardC.play();
        await promise;

        // Assert: Player A hero has a weapon equipped
        expect(heroA.child.weapon).toBeDefined();
        // Assert: Weapon attack is 1
        expect(heroA.child.weapon?.child.attack.state.current).toBe(1);
        // Assert: Weapon durability is 3
        expect(heroA.child.weapon?.child.action.state.current).toBe(3);
    });

    test('upgrade-cast', async () => {
        // Turn switches to Player B
        game.child.turn.next();
        expect(game.child.turn.refer.current).toBe(playerB);

        expect(heroB.child.weapon).toBeDefined();

        // Player B casts Upgrade!
        let promise = cardD.play();
        await promise;

        // Assert: Fiery War Axe attack becomes 4
        expect(weaponB.child.attack.state.current).toBe(4);
        expect(heroB.child.attack.state.current).toBe(4);
        // Assert: Fiery War Axe durability becomes 3
        expect(weaponB.child.action.state.current).toBe(3);

    });
});

