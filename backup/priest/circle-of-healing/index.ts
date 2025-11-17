/**
 * Circle of Healing
 * It isn't really a circle.
 * 
 * Restore 4 Health to ALL minions.
 * 
 * Type: Spell
 * Spell School: Holy
 * Rarity: Common
 * Set: Legacy
 * Class: Priest
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Daarken
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { CircleOfHealingEffectModel } from "./effect";

@LibraryUtil.is('circle-of-healing')
export class CircleOfHealingModel extends SpellCardModel {
    constructor(props?: CircleOfHealingModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Circle of Healing",
                desc: "Restore 4 Health to ALL minions.",
                flavorDesc: "It isn't really a circle.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PRIEST,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 0 }}),
                effects: props.child?.effects ?? [new CircleOfHealingEffectModel()],
                ...props.child
            }
        });
    }
}
