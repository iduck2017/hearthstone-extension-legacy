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

import { ChargeModel, RoleHealthModel, RoleAttackModel, MinionCardModel, MinionFeaturesModel, ClassType, RarityType, CostModel, LibraryUtil } from "hearthstone-core";

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
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 5 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 2 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: {
                        charge: new ChargeModel({ state: { isActive: true } })
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
