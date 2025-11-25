/**
 * Soulfire
 *
 * Are you lighting a soul on fire? Or burning someone with your OWN soul? This seems like an important distinction.
 *
 * Deal 4 damage. Discard a random card.
 *
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Raymond Swanland
 * Collectible
 *
 * 1 mana
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { SoulfireEffectModel } from "./effect";

@LibraryUtil.is('soulfire')
export class SoulfireModel extends SpellCardModel {
    constructor(props?: SoulfireModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Soulfire",
                desc: "Deal 4 damage. Discard a random card.",
                flavorDesc: "Are you lighting a soul on fire? Or burning someone with your OWN soul? This seems like an important distinction.",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARLOCK,
                schools: [SchoolType.FIRE],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                effects: props.child?.effects ?? [new SoulfireEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

