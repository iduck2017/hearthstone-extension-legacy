/*
 * Ironfur Grizzly 3/3/3
 * "Bear Carcass 1/10"
 * Taunt
 * Type: Minion
 * Minion Type: Beast
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Lars Grant-West
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType, RoleFeatsModel, TauntModel } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('ironfur-grizzly')
export class IronfurGrizzlyModel extends MinionCardModel {
    constructor(loader?: Loader<IronfurGrizzlyModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Ironfur Grizzly',
                    desc: 'Taunt',
                    flavorDesc: '"Bear Carcass 1/10"',
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [RaceType.BEAST],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 3 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 3 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 3 }})),
                            feats: new RoleFeatsModel(() => ({
                                child: {
                                    taunt: new TauntModel()
                                }
                            }))
                        }
                    })),
                    feats: new MinionFeatsModel(() => ({
                        child: { 
                            battlecry: []
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
