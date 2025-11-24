/**
 * Hammer of Wrath
 * 
 * A good paladin has many tools. Hammer of Wrath, Pliers of Vengeance, Hacksaw of Justice, etc.
 * 
 * Deal 3 damage. Draw a card.
 * 
 * Type: Spell
 * Rarity: Common
 * Set: Legacy
 * Class: Paladin
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Efrem Palacios
 * Collectible
 * 
 * 3 mana
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { HammerOfWrathEffectModel } from "./effect";

@LibraryUtil.is('hammer-of-wrath')
export class HammerOfWrathModel extends SpellCardModel {
    constructor(props?: HammerOfWrathModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Hammer of Wrath",
                desc: "Deal *3* damage. Draw a card.",
                flavorDesc: "A good paladin has many tools. Hammer of Wrath, Pliers of Vengeance, Hacksaw of Justice, etc.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                effects: props.child?.effects ?? [new HammerOfWrathEffectModel()],
                ...props.child
            }
        });
    }
}

