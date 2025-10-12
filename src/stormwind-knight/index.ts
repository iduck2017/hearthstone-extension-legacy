/*
 * Stormwind Knight 4/2/5
 * They're still embarrassed about "The Deathwing Incident".
 * Charge
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Ladronn
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeaturesModel, RarityType, RoleAttackModel, RoleModel, RaceType, ChargeModel, RoleFeaturesModel } from "hearthstone-core";

@LibraryUtil.is('stormwind-knight')
export class StormwindKnightModel extends MinionCardModel {
    constructor(props?: StormwindKnightModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Stormwind Knight',
                desc: 'Charge',
                flavorDesc: 'They\'re still embarrassed about "The Deathwing Incident".',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 4 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 2 }}),
                        health: new RoleHealthModel({ state: { origin: 5 }}),
                        feats: new RoleFeaturesModel({
                            child: {
                                charge: new ChargeModel({ state: { isActive: true } })
                            }
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
