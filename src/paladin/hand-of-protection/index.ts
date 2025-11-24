/**
 * Hand of Protection
 * 
 * This spell has been renamed so many times, even paladins don't know what it should be called anymore.
 * 
 * Give a minion Divine Shield.
 * 
 * Type: Spell
 * Rarity: Common
 * Set: Legacy
 * Class: Paladin
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Clint Langley
 * Collectible
 * 
 * 1 mana
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { HandOfProtectionEffectModel } from "./effect";

@LibraryUtil.is('hand-of-protection')
export class HandOfProtectionModel extends SpellCardModel {
    constructor(props?: HandOfProtectionModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Hand of Protection",
                desc: "Give a minion Divine Shield.",
                flavorDesc: "This spell has been renamed so many times, even paladins don't know what it should be called anymore.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                effects: props.child?.effects ?? [new HandOfProtectionEffectModel()],
                ...props.child
            }
        });
    }
}

