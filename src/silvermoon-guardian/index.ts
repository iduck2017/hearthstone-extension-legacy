/*
 * Silvermoon Guardian 4/3/3
 * The first time they tried to guard Silvermoon against the scourge, it didn't go so well…
 * Divine Shield
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Phroilan Gardner
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeaturesModel, RarityType, RoleAttackModel, RaceType, DivineShieldModel } from "hearthstone-core";

@LibraryUtil.is('silvermoon-guardian')
export class SilvermoonGuardianModel extends MinionCardModel {
    constructor(props?: SilvermoonGuardianModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Silvermoon Guardian',
                desc: 'Divine Shield',
                flavorDesc: 'The first time they tried to guard Silvermoon against the scourge, it didn\'t go so well…',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 4 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 3 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: {
                        divineShield: new DivineShieldModel(),
                        battlecry: []
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
