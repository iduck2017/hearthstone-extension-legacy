/**
 * Demonfire
 *
 * Demonfire is like regular fire except for IT NEVER STOPS BURNING HELLLPPP
 *
 * Deal 2 damage to a minion. If it's a friendly Demon, give it +2/+2 instead.
 *
 * Type: Spell
 * Rarity: Common
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Ben Wootten
 * Collectible
 *
 * 2 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { DemonfireEffectModel } from "./effect";

@LibraryService.is('demonfire')
export class DemonfireModel extends SpellCardModel {
    constructor(props?: DemonfireModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Demonfire",
                desc: "Deal 2 damage to a minion. If it's a friendly Demon, give it +2/+2 instead.",
                flavorDesc: "Demonfire is like regular fire except for IT NEVER STOPS BURNING HELLLPPP",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.WARLOCK,
                schools: [SchoolType.FIRE],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                effects: props.child?.effects ?? [new DemonfireEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

