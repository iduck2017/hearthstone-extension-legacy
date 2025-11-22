/**
 * Inner Rage
 * 
 * They're only smiling on the outside.
 * 
 * Deal 1 damage to a minion and give it +2 Attack.
 * 
 * Type: Spell
 * Rarity: Common
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Slawomir Maniak
 * Collectible
 * 
 * 0 mana
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel } from "hearthstone-core";
import { InnerRageEffectModel } from "./effect";

@LibraryUtil.is('inner-rage')
export class InnerRageModel extends SpellCardModel {
    constructor(props?: InnerRageModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Inner Rage",
                desc: "Deal 1 damage to a minion and give it +2 Attack.",
                flavorDesc: "They're only smiling on the outside.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.WARRIOR,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 0 }}),
                effects: props.child?.effects ?? [new InnerRageEffectModel()],
                ...props.child
            }
        });
    }
}

