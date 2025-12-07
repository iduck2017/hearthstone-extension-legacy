/**
 * Charge
 * 
 * "Guys! Guys! Slow down!" - some kind of non-warrior minion
 * 
 * Give a friendly minion +2 Attack and Charge.
 * 
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 * 
 * 3 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SpellCardModel } from "hearthstone-core";
import { ChargeEffectModel } from "./effect";

@LibraryService.is('charge')
export class ChargeModel extends SpellCardModel {
    constructor(props?: ChargeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Charge",
                desc: "Give a friendly minion +2 Attack and Charge.",
                flavorDesc: "\"Guys! Guys! Slow down!\" - some kind of non-warrior minion",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARRIOR,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                effects: props.child?.effects ?? [new ChargeEffectModel()],
                ...props.child
            }
        });
    }
}

