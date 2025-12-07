/**
 * Drain Life
 *
 * "I've just sucked one year of your life away."
 *
 * Deal 2 damage. Restore 2 Health to your hero.
 *
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 *
 * 3 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { DrainLifeEffectModel } from "./effect";

@LibraryService.is('drain-life')
export class DrainLifeModel extends SpellCardModel {
    constructor(props?: DrainLifeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Drain Life",
                desc: "Deal 2 damage. Restore 2 Health to your hero.",
                flavorDesc: "\"I've just sucked one year of your life away.\"",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARLOCK,
                schools: [SchoolType.SHADOW],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                effects: props.child?.effects ?? [new DrainLifeEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

