/*
Scarlet Crusader
Never wash your whites with a Scarlet Crusader.

Divine Shield

Type: Minion
Rarity: Common
Set: Legacy
Class: Neutral
Cost to Craft: 40 / 400 (Golden)
Disenchanting Yield: 5 / 50 (Golden)
Artist: Gonzalo Ordonez
Collectible
*/

import { AttackModel, CardModel, ClassType, DivineSheildModel, HealthModel, MinionModel, RarityType, RoleEntriesModel, RoleModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('scarlet-crusader')
export class ScarletCrusaderModel extends CardModel {
    public constructor(props: CardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Scarlet Crusader',
                desc: 'Divine Shield',
                isCollectible: true,
                flavorDesc: 'Never wash your whites with a Scarlet Crusader.',
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