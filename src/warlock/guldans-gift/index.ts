/**
 * Gul'dan's Gift
 *
 * "This won't be like last time..." -Gul'dan
 *
 * Discover a Temporary Mortal Coil, Siphon Soul, or Twisting Nether.
 *
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Alex Stone
 * Collectible
 *
 * 1 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SpellCardModel } from "hearthstone-core";
import { GuldansGiftEffectModel } from "./effect";

@LibraryService.is('guldans-gift')
export class GuldansGiftModel extends SpellCardModel {
    constructor(props?: GuldansGiftModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Gul'dan's Gift",
                desc: "Discover a Temporary Mortal Coil, Siphon Soul, or Twisting Nether.",
                flavorDesc: "\"This won't be like last time...\" -Gul'dan",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARLOCK,
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                effects: props.child?.effects ?? [new GuldansGiftEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

