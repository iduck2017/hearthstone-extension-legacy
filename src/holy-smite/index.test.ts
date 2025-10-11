/**
 * Test cases for Holy Smite
 * 
 * Initial state: Player A has Holy Smite in hand. Player B has Water Elemental on board.
 * 
 * holy-smite-cast: Player A uses Holy Smite on Player B's Water Elemental.
 * Water Elemental takes 3 damage (from 6 to 3 health).
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, ManaModel, SelectUtil } from "hearthstone-core";
import { HolySmiteModel } from "./index";
import { WaterElementalModel } from "../water-elemental";
import { boot } from "../boot";

describe('holy-smite', () => {
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
                        child: { spells: [new HolySmiteModel()] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                    board: new BoardModel({
                        child: { 
                            minions: [new WaterElementalModel()]
                        }
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
    const cardC = handA.child.spells.find(item => item instanceof HolySmiteModel);
    const cardD = boardB.child.minions.find(item => item instanceof WaterElementalModel);
    const roleD = cardD?.child.role;
    if (!cardC || !roleD) throw new Error();

    test('holy-smite-cast', async () => {
        // Check initial stats
        expect(roleD.child.attack.state.current).toBe(3); // Water Elemental: 3/6
        expect(roleD.child.health.state.current).toBe(6);
        expect(playerA.child.mana.state.current).toBe(10);
        expect(handA.child.spells.length).toBe(1);
        expect(boardB.child.minions.length).toBe(1);

        // Player A uses Holy Smite on Water Elemental
        const promise = cardC.play();
        expect(SelectUtil.current?.options).toContain(roleD);
        SelectUtil.set(roleD);
        await promise;

        // Water Elemental should take 3 damage
        expect(roleD.child.attack.state.current).toBe(3); // Attack unchanged
        expect(roleD.child.health.state.current).toBe(3); // 6 - 3 damage
        expect(playerA.child.mana.state.current).toBe(9); // 10 - 1 cost
        expect(handA.child.spells.length).toBe(0); // Holy Smite consumed
        expect(boardB.child.minions.length).toBe(1); // Minion still on board
    });
});
