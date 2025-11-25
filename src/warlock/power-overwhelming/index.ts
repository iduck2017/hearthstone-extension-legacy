/**
 * Power Overwhelming
 *
 * We cannot even describe how horrible the death is. It's CRAZY bad! Maybe worse than that. Just don't do it.
 *
 * Give a friendly minion +4/+4 until end of turn. Then, it dies. Horribly.
 *
 * Type: Spell
 * Rarity: Common
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Tom Baxa
 * Collectible
 *
 * 1 mana
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { PowerOverwhelmingEffectModel } from "./effect";

@LibraryUtil.is('power-overwhelming')
export class PowerOverwhelmingModel extends SpellCardModel {
    constructor(props?: PowerOverwhelmingModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Power Overwhelming",
                desc: "Give a friendly minion +4/+4 until end of turn. Then, it dies. Horribly.",
                flavorDesc: "We cannot even describe how horrible the death is. It's CRAZY bad! Maybe worse than that. Just don't do it.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.WARLOCK,
                schools: [SchoolType.SHADOW],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                effects: props.child?.effects ?? [new PowerOverwhelmingEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

