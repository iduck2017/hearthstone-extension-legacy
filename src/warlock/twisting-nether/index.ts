/**
 * Twisting Nether
 *
 * The Twisting Nether is a formless place of magic and illusion and destroyed minions.
 *
 * Destroy all minions and locations.
 *
 * Type: Spell
 * Rarity: Epic
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 400 / 1600 (Golden)
 * Disenchanting Yield: 100 / 400 (Golden)
 * Artist: Dave Allsop
 * Collectible
 *
 * 8 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { TwistingNetherEffectModel } from "./effect";

@LibraryService.is('twisting-nether')
export class TwistingNetherModel extends SpellCardModel {
    constructor(props?: TwistingNetherModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Twisting Nether",
                desc: "Destroy all minions and locations.",
                flavorDesc: "The Twisting Nether is a formless place of magic and illusion and destroyed minions.",
                isCollectible: true,
                rarity: RarityType.EPIC,
                class: ClassType.WARLOCK,
                schools: [SchoolType.SHADOW],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 8 }}),
                effects: props.child?.effects ?? [new TwistingNetherEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

