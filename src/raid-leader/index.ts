/*
Raid Leader
"That's a 50 DKP minus!"

Your other minions have +1 Attack.

Type: Minion
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Phill Gonzales
Collectible
*/

import { HealthModel, AttackModel, RoleModel, RaceType, MinionModel, FeaturesModel, RarityType, ClassType, CardModel } from "hearthstone-core";
import { RaidLeaderFeatureModel } from "./feature";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('raid-leader') 
export class RaidLeaderModel extends CardModel {
    constructor(props: RaidLeaderModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Raid Leader',
                desc: 'Your other minions have +1 Attack.',
                isCollectible: true,
                flavorDesc: '"That\'s a 50 DKP minus!"',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 3 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 2 }}),   
                        features: new FeaturesModel({
                            child: {
                                items: [ new RaidLeaderFeatureModel({}) ]
                            }
                        })
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer }
        });
    }
} 