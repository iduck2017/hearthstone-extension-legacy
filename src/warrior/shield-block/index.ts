/**
 * Shield Block
 * 
 * Shields were invented because Face Block is USELESS.
 * 
 * Gain 5 Armor. Draw a card.
 * 
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Michael Komarck
 * Collectible
 * 
 * 2 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SpellCardModel } from "hearthstone-core";
import { ShieldBlockEffectModel } from "./effect";

@LibraryService.is('shield-block')
export class ShieldBlockModel extends SpellCardModel {
    constructor(props?: ShieldBlockModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Shield Block",
                desc: "Gain 5 Armor. Draw a card.",
                flavorDesc: "Shields were invented because Face Block is USELESS.",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARRIOR,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                effects: props.child?.effects ?? [new ShieldBlockEffectModel()],
                ...props.child
            }
        });
    }
}

