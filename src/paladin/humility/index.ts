/**
 * Humility
 * 
 * This card makes something really damp. Oh wait. That's "Humidity."
 * 
 * Change a minion's Attack to 1.
 * 
 * Type: Spell
 * Rarity: Common
 * Set: Legacy
 * Class: Paladin
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Daren Bader
 * Collectible
 * 
 * 1 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { HumilityEffectModel } from "./effect";

@LibraryService.is('humility')
export class HumilityModel extends SpellCardModel {
    constructor(props?: HumilityModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Humility",
                desc: "Change a minion's Attack to 1.",
                flavorDesc: "This card makes something really damp. Oh wait. That's \"Humidity.\"",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                effects: props.child?.effects ?? [new HumilityEffectModel()],
                ...props.child
            }
        });
    }
}

