// Faerie Dragon
// Adorable. Immune to Magic. Doesn't pee on the rug. The perfect pet!
// Elusive
// Type: Minion
// Minion Type: Dragon
// Rarity: Common
// Set: Legacy
// Class: Neutral
// Cost to Craft: 40 / 400 (Golden)
// Disenchanting Yield: 5 / 50 (Golden)
// Artist: Samwise
// Collectible
// Learn More:
// Elusive

import { AttackModel, ClassType, HealthModel, MinionModel, RaceType, RarityType, RoleModel, RoleEntriesModel, ElusiveModel, CardModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";

export class FaerieDragonModel extends CardModel {
    constructor(props: FaerieDragonModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Faerie Dragon',
                desc: 'Elusive',
                flavorDesc: 'Adorable. Immune to Magic. Doesn\'t pee on the rug. The perfect pet!',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                isCollectible: true,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 2 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.DRAGON] },
                    child: {
                        attack: new AttackModel({ state: { origin: 3 }}),
                        health: new HealthModel({ state: { origin: 2 }}), 
                        entries: new RoleEntriesModel({
                            child: {
                                elusive: new ElusiveModel({})
                            }
                        })
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
} 