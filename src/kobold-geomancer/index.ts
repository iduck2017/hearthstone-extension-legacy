/*
Kobold Geomancer
In the old days, Kobolds were the finest candle merchants in the land. Then they got pushed too far...

Spell Damage +1

Type: Minion
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Gabor Szikszai
Collectible
*/

import { AttackModel, ClassType, HealthModel, MinionModel, RaceType, RarityType, RoleModel, SpellDamageModel, RoleEntriesModel, CardModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('kobold-geomancer')
export class KoboldGeomancerModel extends CardModel {
    constructor(props: KoboldGeomancerModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Kobold Geomancer',
                desc: 'Spell Damage +1',
                isCollectible: true,
                flavorDesc: 'In the old days, Kobolds were the finest candle merchants in the land. Then they got pushed too far...',
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
                        health: new HealthModel({ state: { origin: 2 }}), 
                        entries: new RoleEntriesModel({
                            child: { 
                                spellDamage: new SpellDamageModel({ state: { origin: 1 }})
                            }
                        }),
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer }
        });
    }
} 