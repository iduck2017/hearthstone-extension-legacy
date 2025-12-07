/**
 * Cleave
 * 
 * Hey you two…could you stand next to each other for a second…
 * 
 * Deal 2 damage to two random enemy minions.
 * 
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Phroilan Gardner
 * Collectible
 * 
 * 2 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SpellCardModel } from "hearthstone-core";
import { CleaveEffectModel } from "./effect";

@LibraryService.is('cleave')
export class CleaveModel extends SpellCardModel {
    constructor(props?: CleaveModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Cleave",
                desc: "Deal 2 damage to two random enemy minions.",
                flavorDesc: "Hey you two…could you stand next to each other for a second…",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARRIOR,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                effects: props.child?.effects ?? [new CleaveEffectModel()],
                ...props.child
            }
        });
    }
}

