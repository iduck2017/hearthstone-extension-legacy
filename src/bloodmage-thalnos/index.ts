// Bloodmage Thalnos
// He's in charge of the Annual Scarlet Monastery Blood Drive!
// Spell Damage +1 Deathrattle: Draw a card.
// Type: Minion
// Minion Type: Undead
// Rarity: Legendary
// Set: Legacy
// Class: Neutral
// Cost to Craft: 1600 / 3200 (Golden)
// Disenchanting Yield: 400 / 1600 (Golden)
// Artist: Alex Horley Orlandelli
// Collectible
// Learn More:
// Deathrattle
// Spell Damage

import { AttackModel, ClassType, HealthModel, MinionModel, RaceType, RarityType, RoleModel, SpellDamageModel, RoleEntriesModel, CardHooksModel, CardModel } from "hearthstone-core";
import { BloodmageThalnosDeathrattleModel } from "./deathrattle";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('bloodmage-thalnos')
export class BloodmageThalnosModel extends CardModel {
    constructor(props: BloodmageThalnosModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Bloodmage Thalnos',
                desc: 'Spell Damage +1 Deathrattle: Draw a card.',
                flavorDesc: 'He\'s in charge of the Annual Scarlet Monastery Blood Drive!',
                rarity: RarityType.LEGENDARY,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 2 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.UNDEAD] },
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 1 }}), 
                        entries: new RoleEntriesModel({
                            child: { 
                                spellDamage: new SpellDamageModel({ state: { origin: 1 }})
                            }
                        }),
                    }
                }),
                hooks: new CardHooksModel({
                    child: {
                        deathrattle: [new BloodmageThalnosDeathrattleModel({})]
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
} 