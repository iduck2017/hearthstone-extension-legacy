/**
 * Sense Demons
 *
 * Generally demons are pretty obvious and you don't need a spell to sense them.
 *
 * Draw 2 Demons from your deck.
 *
 * Type: Spell
 * Rarity: Common
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Raven Mimura
 * Collectible
 *
 * 3 mana
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { SenseDemonsEffectModel } from "./effect";

@LibraryUtil.is('sense-demons')
export class SenseDemonsModel extends SpellCardModel {
    constructor(props?: SenseDemonsModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Sense Demons",
                desc: "Draw 2 Demons from your deck.",
                flavorDesc: "Generally demons are pretty obvious and you don't need a spell to sense them.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.WARLOCK,
                schools: [SchoolType.SHADOW],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                effects: props.child?.effects ?? [new SenseDemonsEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

