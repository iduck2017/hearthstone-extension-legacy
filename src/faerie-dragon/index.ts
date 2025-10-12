/*
 * Faerie Dragon 2/3/2
 * Adorable. Immune to Magic. Doesn't pee on the rug. The perfect pet!
 * Elusive
 * Type: Minion
 * Minion Type: Dragon
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Samwise
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeaturesModel, RarityType, RoleAttackModel, RoleModel, RaceType, ElusiveModel, RoleFeaturesModel } from "hearthstone-core";

@LibraryUtil.is('faerie-dragon')
export class FaerieDragonModel extends MinionCardModel {
    constructor(props?: FaerieDragonModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Faerie Dragon',
                desc: 'Elusive',
                flavorDesc: 'Adorable. Immune to Magic. Doesn\'t pee on the rug. The perfect pet!',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.DRAGON],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 2 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 3 }}),
                        health: new RoleHealthModel({ state: { origin: 2 }}),
                        feats: new RoleFeaturesModel({
                            child: { elusive: new ElusiveModel() }
                        })
                    }
                }),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { 
                        battlecry: []
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
