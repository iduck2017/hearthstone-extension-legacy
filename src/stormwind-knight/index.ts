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

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType, ChargeModel, RoleFeatsModel } from "hearthstone-core";

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
                cost: new CostModel({ state: { origin: 4 }}),
                role: new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 2 }}),
                        health: new RoleHealthModel({ state: { origin: 5 }}),
                        feats: new RoleFeatsModel({
                            child: {
                                charge: new ChargeModel({ state: { isActive: true } })
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
