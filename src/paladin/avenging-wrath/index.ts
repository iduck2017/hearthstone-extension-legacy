/**
 * Avenging Wrath
 *
 * Wham! Wham! Wham! Wham! Wham! Wham! Wham! Wham!
 *
 * Deal 8 damage randomly split among all enemies.
 *
 * Type: Spell
 * Rarity: Epic
 * Set: Legacy
 * Class: Paladin
 * Cost to Craft: 400 / 1600 (Golden)
 * Disenchanting Yield: 100 / 400 (Golden)
 * Artist: Alex Garner
 * Collectible
 *
 * 6 mana
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { AvengingWrathEffectModel } from "./effect";

@LibraryUtil.is('avenging-wrath')
export class AvengingWrathModel extends SpellCardModel {
    constructor(props?: AvengingWrathModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Avenging Wrath",
                desc: "Deal 8 damage randomly split among all enemies.",
                flavorDesc: "Wham! Wham! Wham! Wham! Wham! Wham! Wham! Wham!",
                isCollectible: true,
                rarity: RarityType.EPIC,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 6 }}),
                effects: props.child?.effects ?? [new AvengingWrathEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

