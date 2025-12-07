/**
 * Sacrificial Pact
 *
 * This is the reason that Demons never really become friends with Warlocks.
 *
 * Destroy a friendly Demon. Restore 5 Health to your hero.
 *
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Jim Nelson
 * Collectible
 *
 * 0 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { SacrificialPactEffectModel } from "./effect";

@LibraryService.is('sacrificial-pact')
export class SacrificialPactModel extends SpellCardModel {
    constructor(props?: SacrificialPactModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Sacrificial Pact",
                desc: "Destroy a friendly Demon. Restore 5 Health to your hero.",
                flavorDesc: "This is the reason that Demons never really become friends with Warlocks.",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARLOCK,
                schools: [SchoolType.SHADOW],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 0 }}),
                effects: props.child?.effects ?? [new SacrificialPactEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

