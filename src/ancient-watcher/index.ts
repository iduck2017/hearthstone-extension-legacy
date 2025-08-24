// Ancient Watcher
// Why do its eyes seem to follow you as you walk by?
// Can't attack.
// Type: Minion
// Rarity: Rare
// Set: Legacy
// Class: Neutral
// Cost to Craft: 100 / 800 (Golden)
// Disenchanting Yield: 20 / 100 (Golden)
// Artist: Richard Wright
// Collectible

import { AttackModel, CardModel, ClassType, FeaturesModel, HealthModel, MinionModel, RarityType, RoleModel } from "hearthstone-core";
import { AncientWatcherFeatureModel } from "./feature";
import { CostModel } from "hearthstone-core";

export class AncientWatcherModel extends CardModel {
    constructor(props: AncientWatcherModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Ancient Watcher',
                desc: 'Can\'t attack.',
                flavorDesc: 'Why do its eyes seem to follow you as you walk by?',
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 2 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 4 }}),
                        health: new HealthModel({ state: { origin: 5 }}), 
                        features: new FeaturesModel({
                            child: { items: [
                                new AncientWatcherFeatureModel({})
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