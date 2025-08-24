// Amani Berserker
// If an Amani berserker asks "Joo lookin' at me?!", the correct response is "Nah, mon".
// Has +3 Attack while damaged.
// Type: Minion
// Rarity: Common
// Set: Legacy
// Class: Neutral
// Cost to Craft: 40 / 400 (Golden)
// Disenchanting Yield: 5 / 50 (Golden)
// Artist: Chippy
// Collectible

import { AttackModel, CardModel, ClassType, FeaturesModel, HealthModel, MinionModel, RaceType, RarityType, RoleModel } from "hearthstone-core";
import { AmaniBerserkerFeatureModel } from "./feature";
import { CostModel } from "hearthstone-core";

export class AmaniBerserkerModel extends CardModel {
    constructor(props: AmaniBerserkerModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Amani Berserker',
                desc: 'Has +3 Attack while damaged.',
                flavorDesc: 'If an Amani berserker asks "Joo lookin\' at me?!", the correct response is "Nah, mon".',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 2 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 3 }}), 
                        features: new FeaturesModel({
                            child: { items: [
                                new AmaniBerserkerFeatureModel({})
                            ]}
                        })  
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
} 