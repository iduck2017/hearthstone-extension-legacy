/**
 * Hellfire
 *
 * It's spells like these that make it hard for Warlocks to get decent help.
 *
 * Deal 3 damage to ALL characters.
 *
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Chippy
 * Collectible
 *
 * 3 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { HellfireEffectModel } from "./effect";

@LibraryService.is('hellfire')
export class HellfireModel extends SpellCardModel {
    constructor(props?: HellfireModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Hellfire",
                desc: "Deal 3 damage to ALL characters.",
                flavorDesc: "It's spells like these that make it hard for Warlocks to get decent help.",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARLOCK,
                schools: [SchoolType.FIRE],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                effects: props.child?.effects ?? [new HellfireEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

