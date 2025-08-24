/*
Azure Drake
They initially planned to be the Beryl or Cerulean drakes, but those felt a tad too pretentious.

Spell Damage +1 Battlecry: Draw a card.

Type: Minion
Minion Type: Dragon
Rarity: Rare
Set: Legacy
Class: Neutral
Cost to Craft: 100 / 800 (Golden)
Disenchanting Yield: 20 / 100 (Golden)
Artist: Ben Zhang
Collectible
*/

import { MinionModel, HealthModel, AttackModel, RoleModel, ClassType, RarityType, CardModel, RaceType, RoleEntriesModel, SpellDamageModel, CardHooksModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";
import { AzureDrakeBattlecryModel } from "./battlecry";

@LibraryUtil.is('azure-drake')
export class AzureDrakeModel extends CardModel {
    constructor(props: AzureDrakeModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Azure Drake',
                desc: 'Spell Damage +1 Battlecry: Draw a card.',
                isCollectible: true,
                flavorDesc: 'They initially planned to be the Beryl or Cerulean drakes, but those felt a tad too pretentious.',
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 5 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.DRAGON] },
                    child: {
                        attack: new AttackModel({ state: { origin: 4 }}),
                        health: new HealthModel({ state: { origin: 4 }}),
                        entries: new RoleEntriesModel({
                            child: {
                                // Add Spell Damage effect
                                spellDamage: new SpellDamageModel({ state: { origin: 1 }})
                            }
                        })
                    },
                }),
                hooks: new CardHooksModel({
                    child: {
                        // Link battlecry effect
                        battlecry: [new AzureDrakeBattlecryModel({})]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 