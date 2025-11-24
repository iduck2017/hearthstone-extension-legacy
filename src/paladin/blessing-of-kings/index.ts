/**
 * Blessing of Kings
 * 
 * Given the number of kings who have been assassinated, are you sure you want their blessing?
 * 
 * Give a minion +4/+4. (+4 Attack/+4 Health)
 * 
 * Type: Spell
 * Rarity: Common
 * Set: Legacy
 * Class: Paladin
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Lucas Graciano
 * Collectible
 * 
 * 4 mana
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { BlessingOfKingsEffectModel } from "./effect";

@LibraryUtil.is('blessing-of-kings')
export class BlessingOfKingsModel extends SpellCardModel {
    constructor(props?: BlessingOfKingsModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Blessing of Kings",
                desc: "Give a minion +4/+4. <i>(+4 Attack/+4 Health)</i>",
                flavorDesc: "Given the number of kings who have been assassinated, are you sure you want their blessing?",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 4 }}),
                effects: props.child?.effects ?? [new BlessingOfKingsEffectModel()],
                ...props.child
            }
        });
    }
}

