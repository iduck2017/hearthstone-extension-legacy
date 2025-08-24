/*
Ogre Magi
Training Ogres in the art of spellcasting is a questionable decision.

Spell Damage +1

Type: Minion
Rarity: Free
Set: Legacy
Class: Neutral
Artist: James Ryman
Collectible
*/

import { AttackModel, ClassType, HealthModel, MinionModel, RaceType, RarityType, RoleModel, SpellDamageModel, RoleEntriesModel, CardModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('ogre-magi')
export class OgreMagiModel extends CardModel {
    constructor(props: OgreMagiModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Ogre Magi',
                desc: 'Spell Damage +1',
                isCollectible: true,
                flavorDesc: 'Training Ogres in the art of spellcasting is a questionable decision.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 4 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 4 }}),
                        health: new HealthModel({ state: { origin: 4 }}), 
                        entries: new RoleEntriesModel({
                            child: { 
                                // Add Spell Damage effect
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