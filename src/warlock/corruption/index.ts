/**
 * Corruption
 *
 * It starts with stealing a pen from work, and before you know it, BOOOM! Corrupted!
 *
 * Choose an enemy minion. At the start of your turn, destroy it.
 *
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Wayne Reynolds
 * Collectible
 *
 * 1 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { CorruptionEffectModel } from "./effect";

@LibraryService.is('corruption')
export class CorruptionModel extends SpellCardModel {
    constructor(props?: CorruptionModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Corruption",
                desc: "Choose an enemy minion. At the start of your turn, destroy it.",
                flavorDesc: "It starts with stealing a pen from work, and before you know it, BOOOM! Corrupted!",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARLOCK,
                schools: [SchoolType.SHADOW],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                effects: props.child?.effects ?? [new CorruptionEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

