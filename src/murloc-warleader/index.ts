/*
Murloc Warleader
Do Murlocs ever get tired of making the same old sound? Nope! Mrglglrglglglglglglgl!

Your other Murlocs have +2 Attack.

Type: Minion
Minion Type: Murloc
Rarity: Epic
Set: Legacy
Class: Neutral
Cost to Craft: 400 / 1600 (Golden)
Disenchanting Yield: 100 / 400 (Golden)
Artist: Tim McBurnie
Collectible
*/

import { HealthModel, AttackModel, RoleModel, RaceType, MinionModel, FeaturesModel, RarityType, ClassType, CardModel } from "hearthstone-core";
import { MurlocWarleaderFeatureModel } from "./feature";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('murloc-warleader') 
export class MurlocWarleaderModel extends CardModel {
    constructor(props: MurlocWarleaderModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Warleader',
                desc: 'Your other Murlocs have +2 Attack.',
                isCollectible: true,
                flavorDesc: 'Do Murlocs ever get tired of making the same old sound? Nope! Mrglglrglglglglglglgl!',
                rarity: RarityType.EPIC,
                class: ClassType.NEUTRAL,
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 3 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.MURLOC] },
                    child: {
                        attack: new AttackModel({ state: { origin: 3 }}),
                        health: new HealthModel({ state: { origin: 3 }}),   
                        features: new FeaturesModel({
                            child: {
                                items: [ new MurlocWarleaderFeatureModel({}) ]
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