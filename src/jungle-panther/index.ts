/*
Jungle Panther
Stranglethorn is a beautiful place to visit, but you wouldn't want to live there.

Stealth

Type: Minion
Minion Type: Beast
Rarity: Common
Set: Legacy
Class: Neutral
Cost to Craft: 40 / 400 (Golden)
Disenchanting Yield: 5 / 50 (Golden)
Artist: Jaemin Kim
Collectible
*/

import { MinionModel, FeatureModel, HealthModel, AttackModel, RoleModel, CardHooksModel, ClassType, RarityType, CardModel, RaceType, RoleEntriesModel, StealthModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('jungle-panther')
export class JunglePantherModel extends CardModel {
    constructor(props: JunglePantherModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Jungle Panther',
                desc: 'Stealth',
                isCollectible: true,
                flavorDesc: 'Stranglethorn is a beautiful place to visit, but you wouldn\'t want to live there.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 3 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.BEAST] },
                    child: {
                        attack: new AttackModel({ state: { origin: 4 }}),
                        health: new HealthModel({ state: { origin: 2 }}),   
                        entries: new RoleEntriesModel({
                            child: {
                                // Add Stealth effect
                                stealth: new StealthModel({})
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