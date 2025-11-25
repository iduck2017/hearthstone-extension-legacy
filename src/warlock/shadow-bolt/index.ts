/**
 * Shadow Bolt
 *
 * It's a Bolt. It's made out of Shadow. What more do you need to know!
 *
 * Deal 4 damage to a minion.
 *
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Dave Allsop
 * Collectible
 *
 * 3 mana
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { ShadowBoltEffectModel } from "./effect";

@LibraryUtil.is('shadow-bolt')
export class ShadowBoltModel extends SpellCardModel {
    constructor(props?: ShadowBoltModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Shadow Bolt",
                desc: "Deal 4 damage to a minion.",
                flavorDesc: "It's a Bolt. It's made out of Shadow. What more do you need to know!",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARLOCK,
                schools: [SchoolType.SHADOW],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                effects: props.child?.effects ?? [new ShadowBoltEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

