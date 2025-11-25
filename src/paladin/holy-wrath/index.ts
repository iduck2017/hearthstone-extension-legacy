/**
 * Holy Wrath
 *
 * C'mon Molten Giant!!
 *
 * Draw a card and deal damage equal to its Cost.
 *
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Paladin
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Justin Sweet
 * Collectible
 *
 * 5 mana
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { HolyWrathEffectModel } from "./effect";

@LibraryUtil.is('holy-wrath')
export class HolyWrathModel extends SpellCardModel {
    constructor(props?: HolyWrathModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Holy Wrath",
                desc: "Draw a card and deal damage equal to its Cost.",
                flavorDesc: "C'mon Molten Giant!!",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 5 }}),
                effects: props.child?.effects ?? [new HolyWrathEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

