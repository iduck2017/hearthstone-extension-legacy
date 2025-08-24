// Dire Wolf Alpha
// We are pretty excited about the upcoming release of Dire Wolf Beta, just repost this sign for a chance at a key.
// Adjacent minions have +1 Attack.
// Type: Minion
// Minion Type: Beast
// Rarity: Common
// Set: Legacy
// Class: Neutral
// Cost to Craft: 40 / 400 (Golden)
// Disenchanting Yield: 5 / 50 (Golden)
// Artist: John Dickenson
// Collectible

import { AttackModel, CardModel, ClassType, FeaturesModel, HealthModel, MinionModel, RaceType, RarityType, RoleModel } from "hearthstone-core";
import { DireWolfAlphaFeatureModel } from "./feature";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('dire-wolf-alpha')
export class DireWolfAlphaModel extends CardModel {
    constructor(props: DireWolfAlphaModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Dire Wolf Alpha',
                desc: 'Adjacent minions have +1 Attack.',
                isCollectible: true,
                flavorDesc: 'We are pretty excited about the upcoming release of Dire Wolf Beta, just repost this sign for a chance at a key.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 2 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.BEAST] },
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 2 }}), 
                        features: new FeaturesModel({
                            child: { items: [
                                new DireWolfAlphaFeatureModel({})
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