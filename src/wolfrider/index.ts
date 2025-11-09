/*
 * Wolfrider 3/3/1
 * Orcish raiders ride wolves because they are well adapted to harsh environments, and because they are soft and cuddly.
 * Charge
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Dany Orizio
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeaturesModel, RarityType, RoleAttackModel, RaceType, ChargeModel } from "hearthstone-core";

@LibraryUtil.is('wolfrider')
export class WolfriderModel extends MinionCardModel {
    constructor(props?: WolfriderModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Wolfrider',
                desc: 'Charge',
                flavorDesc: 'Orcish raiders ride wolves because they are well adapted to harsh environments, and because they are soft and cuddly.',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 3 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 3 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: {
                        charge: new ChargeModel({ state: { isActive: true } }),
                        battlecry: []
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
