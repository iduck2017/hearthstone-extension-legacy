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

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType, RoleFeatsModel, DivineShieldModel } from "hearthstone-core";

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
                cost: new CostModel({ state: { origin: 4 }}),
                role: new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 3 }}),
                        health: new RoleHealthModel({ state: { origin: 3 }}),
                        feats: new RoleFeatsModel({
                            child: {
                                divineShield: new DivineShieldModel()
                            }
                        })
                    }
                }),
                feats: new MinionFeatsModel({
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
