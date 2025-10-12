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

import { ChargeModel, RoleHealthModel, RoleAttackModel, MinionCardModel, RoleModel, RoleFeaturesModel, ClassType, RarityType, CostModel, LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('reckless-rocketeer')
export class RecklessRocketeerModel extends MinionCardModel {
    constructor(props?: RecklessRocketeerModel['props']) {
        props = props ?? {};
        super({
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
                cost: props.child?.cost ??  new CostModel({ state: { origin: 6 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 5 }}),
                        health: new RoleHealthModel({ state: { origin: 2 }}),
                        feats: new RoleFeaturesModel({
                            child: {
                                charge: new ChargeModel({ state: { isActive: true } })
                            }
                        })
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
