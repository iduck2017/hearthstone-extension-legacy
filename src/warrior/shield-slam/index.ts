/**
 * Shield Slam
 * 
 * "What is a better weapon? The sharp one your enemies expect, or the blunt one they ignore?" - The Art of Warrior, Chapter 9
 * 
 * Deal 1 damage to a minion for each Armor you have.
 * 
 * Type: Spell
 * Rarity: Epic
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 400 / 1600 (Golden)
 * Disenchanting Yield: 100 / 400 (Golden)
 * Artist: Raymond Swanland
 * Collectible
 * 
 * 1 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SpellCardModel } from "hearthstone-core";
import { ShieldSlamEffectModel } from "./effect";

@LibraryService.is('shield-slam')
export class ShieldSlamModel extends SpellCardModel {
    constructor(props?: ShieldSlamModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Shield Slam",
                desc: "Deal 1 damage to a minion for each Armor you have.",
                flavorDesc: "\"What is a better weapon? The sharp one your enemies expect, or the blunt one they ignore?\" - The Art of Warrior, Chapter 9",
                isCollectible: true,
                rarity: RarityType.EPIC,
                class: ClassType.WARRIOR,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                effects: props.child?.effects ?? [new ShieldSlamEffectModel()],
                ...props.child
            },
        });
    }
}

