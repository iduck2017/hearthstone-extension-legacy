/*
 * Sunwalker
 * She doesn't ACTUALLY walk on the Sun. It's just a name. Don't worry!
 * Taunt Divine Shield
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Andrea Uderzo
 * Collectible
 */

import { TauntModel, RoleHealthModel, RoleAttackModel, MinionCardModel, RoleModel, RoleEntriesModel, ClassType, RarityType, DivineShieldModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('sunwalker')
export class SunwalkerModel extends MinionCardModel {
    constructor(loader?: Loader<SunwalkerModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Sunwalker',
                    desc: 'Taunt Divine Shield',
                    isCollectible: true,
                    flavorDesc: 'She doesn\'t ACTUALLY walk on the Sun. It\'s just a name. Don\'t worry!',
                    rarity: RarityType.RARE,
                    class: ClassType.NEUTRAL,
                    races: [],
                    ...props.state,
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 6 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 4 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 5 }})),
                            entries: new RoleEntriesModel(() => ({
                                child: {
                                    taunt: new TauntModel(),
                                    divineShield: new DivineShieldModel()
                                }
                            }))
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
