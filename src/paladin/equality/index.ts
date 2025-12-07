/**
 * Equality
 * 
 * "We are all equal in the eyes of the Light. Except for that guy. He's a jerk." - Turalyon
 * 
 * Change the Health of ALL minions to 1.
 * 
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Paladin
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: James Ryman
 * Collectible
 * 
 * 2 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { EqualityEffectModel } from "./effect";

@LibraryService.is('equality')
export class EqualityModel extends SpellCardModel {
    constructor(props?: EqualityModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Equality",
                desc: "Change the Health of ALL minions to 1.",
                flavorDesc: "\"We are all equal in the eyes of the Light. Except for that guy. He's a jerk.\" - Turalyon",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                effects: props.child?.effects ?? [new EqualityEffectModel()],
                ...props.child
            }
        });
    }
}

