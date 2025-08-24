/*
Mogu'shan Warden
All these guys ever do is talk about the Thunder King. BOOOORRRINNG!

Taunt

Type: Minion
Rarity: Common
Set: Legacy
Class: Neutral
Cost to Craft: 40 / 400 (Golden)
Disenchanting Yield: 5 / 50 (Golden)
Artist: Cole Eastburn
Collectible
*/

import { MinionModel, FeatureModel, HealthModel, AttackModel, RoleModel, CardHooksModel, ClassType, RarityType, CardModel, RaceType, RoleEntriesModel, TauntModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('mogushan-warden')
export class MogushanWardenModel extends CardModel {
    constructor(props: MogushanWardenModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Mogu\'shan Warden',
                desc: 'Taunt',
                isCollectible: true,
                flavorDesc: 'All these guys ever do is talk about the Thunder King. BOOOORRRINNG!',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 4 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 7 }}),   
                        entries: new RoleEntriesModel({
                            child: {
                                // Add Taunt effect
                                taunt: new TauntModel({})
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