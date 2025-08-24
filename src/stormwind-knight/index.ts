/*
Stormwind Knight
They're still embarrassed about "The Deathwing Incident".

Charge

Type: Minion
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Ladronn
Collectible
*/

import { ChargeModel, HealthModel, AttackModel, MinionModel, RaceType, RoleModel, RoleEntriesModel, ClassType, RarityType, CardModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('stormwind-knight')
export class StormwindKnightModel extends CardModel {
    constructor(props: StormwindKnightModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Stormwind Knight',
                desc: 'Charge',
                isCollectible: true,
                flavorDesc: 'They\'re still embarrassed about "The Deathwing Incident".',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 4 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 5 }}),
                        entries: new RoleEntriesModel({
                            child: {
                                // Add Charge effect
                                charge: new ChargeModel({})
                            }
                        })
                    },
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 