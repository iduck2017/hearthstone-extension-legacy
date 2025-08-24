/*
Silvermoon Guardian
The first time they tried to guard Silvermoon against the scourge, it didn't go so well…

Divine Shield

Type: Minion
Rarity: Common
Set: Legacy
Class: Neutral
Cost to Craft: 40 / 400 (Golden)
Disenchanting Yield: 5 / 50 (Golden)
Artist: Phroilan Gardner
Collectible
*/

import { AttackModel, CardModel, ClassType, DivineSheildModel, HealthModel, MinionModel, RarityType, RoleEntriesModel, RoleModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('silvermoon-guardian')
export class SilvermoonGuardianModel extends CardModel {
    public constructor(props: CardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Silvermoon Guardian',
                desc: 'Divine Shield',
                isCollectible: true,
                flavorDesc: 'The first time they tried to guard Silvermoon against the scourge, it didn\'t go so well…',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 4 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 3 }}),
                        health: new HealthModel({ state: { origin: 3 }}),   
                        entries: new RoleEntriesModel({ 
                            child: { 
                                // Add Divine Shield effect
                                divineShield: new DivineSheildModel({})
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