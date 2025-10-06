/*
 * Reckless Rocketeer
 * One Insane Rocketeer. One Rocket full of Explosives. Infinite Fun.
 * Charge
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: John Polidora
 * Collectible
 */

import { ChargeModel, RoleHealthModel, RoleAttackModel, MinionCardModel, RoleModel, RoleEntriesModel, ClassType, RarityType } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('reckless-rocketeer')
export class RecklessRocketeerModel extends MinionCardModel {
    constructor(loader?: Loader<RecklessRocketeerModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Reckless Rocketeer',
                    desc: 'Charge',
                    isCollectible: true,
                    flavorDesc: 'One Insane Rocketeer. One Rocket full of Explosives. Infinite Fun.',
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [],
                    ...props.state,
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 6 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 5 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 2 }})),
                            entries: new RoleEntriesModel(() => ({
                                child: {
                                    charge: new ChargeModel(() => ({ state: { isActive: true } }))
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
