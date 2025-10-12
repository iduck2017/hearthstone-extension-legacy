/**
 * Crimson Clergy
 * 
 * He won't drop the ball.
 * 
 * Overheal: Draw a card.
 * 
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Priest
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Konstantin Porubov
 * Collectible
 * 
 * 1/1/3
 */

import { ClassType, CostModel, LibraryUtil, RarityType, MinionCardModel, MinionFeaturesModel, RoleAttackModel, RoleHealthModel, RoleModel, RoleFeaturesModel } from "hearthstone-core";
import { CrimsonClergyOverhealModel } from "./overheal";

@LibraryUtil.is('crimson-clergy')
export class CrimsonClergyModel extends MinionCardModel {
    constructor(props?: CrimsonClergyModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Crimson Clergy',
                desc: 'Overheal: Draw a card.',
                flavorDesc: 'He won\'t drop the ball.',
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.PRIEST,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 1 }}),
                        health: new RoleHealthModel({ state: { origin: 3 }}),
                        feats: new RoleFeaturesModel({
                            child: { overheal: [new CrimsonClergyOverhealModel()] }
                        })
                    },
                }),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { battlecry: [] }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
