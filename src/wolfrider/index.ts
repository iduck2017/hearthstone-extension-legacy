/*
Wolfrider
Orcish raiders ride wolves because they are well adapted to harsh environments, and because they are soft and cuddly.

Charge

Type: Minion
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Dany Orizio
Collectible
*/

import { MinionModel, HealthModel, AttackModel, RoleModel, ClassType, RarityType, CardModel, RaceType, RoleEntriesModel, ChargeModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('wolfrider')
export class WolfriderModel extends CardModel {
    constructor(props: WolfriderModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Wolfrider',
                desc: 'Charge',
                isCollectible: true,
                flavorDesc: 'Orcish raiders ride wolves because they are well adapted to harsh environments, and because they are soft and cuddly.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 3 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 3 }}),
                        health: new HealthModel({ state: { origin: 1 }}),
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