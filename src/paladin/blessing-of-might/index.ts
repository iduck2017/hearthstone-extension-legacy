/**
 * Blessing of Might
 * 
 * "As in, you MIGHT want to get out of my way." - Toad Mackle, recently buffed.
 * 
 * Give a minion +3 Attack.
 * 
 * Type: Spell
 * Rarity: Common
 * Set: Legacy
 * Class: Paladin
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Zoltan Boros
 * Collectible
 * 
 * 1 mana
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { BlessingOfMightEffectModel } from "./effect";

@LibraryUtil.is('blessing-of-might')
export class BlessingOfMightModel extends SpellCardModel {
    constructor(props?: BlessingOfMightModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Blessing of Might",
                desc: "Give a minion +3 Attack.",
                flavorDesc: "\"As in, you MIGHT want to get out of my way.\" - Toad Mackle, recently buffed.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                effects: props.child?.effects ?? [new BlessingOfMightEffectModel()],
                ...props.child
            }
        });
    }
}

