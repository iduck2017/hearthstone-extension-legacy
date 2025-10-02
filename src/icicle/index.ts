/**
 * Icicle 2
 * 
 * This may appear weak at frost glance, but it's actually a very ice spell.
 * Deal 2 damage to a minion. If it's Frozen, draw a card.
 * 
 * Type: Spell
 * Spell School: Frost
 * Rarity: Epic
 * Set: Legacy
 * Class: Mage
 * Cost to Craft: 400 / 1600 (Golden)
 * Disenchanting Yield: 100 / 400 (Golden)
 * Artist: Arthur Gimaldinov
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { IcicleEffectModel } from "./effect";

@LibraryUtil.is('icicle')
export class IcicleModel extends SpellCardModel {
    constructor(loader?: Loader<IcicleModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Icicle",
                    desc: "Deal 2 damage to a minion. If it's Frozen, draw a card.",
                    flavorDesc: "This may appear weak at frost glance, but it's actually a very ice spell.",
                    isCollectible: true,
                    rarity: RarityType.EPIC,
                    class: ClassType.MAGE,
                    schools: [SchoolType.FROST],
                    ...props.state
                },
                refer: { ...props.refer },
                child: { 
                    cost: props.child?.cost ?? new CostModel(() => ({ state: { current: 2 }})),
                    effects: props.child?.effects ?? [new IcicleEffectModel()],
                    ...props.child 
                }
            }
        })
    }
}
