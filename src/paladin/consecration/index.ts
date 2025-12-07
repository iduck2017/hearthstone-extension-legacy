/**
 * Consecration
 * 
 * Consecrated ground glows with Holy energy. But it smells a little, too.
 * 
 * Deal 2 damage to all enemies.
 * 
 * Type: Spell
 * Rarity: Common
 * Set: Legacy
 * Class: Paladin
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Vance Kovacs
 * Collectible
 * 
 * 3 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { ConsecrationEffectModel } from "./effect";

@LibraryService.is('consecration')
export class ConsecrationModel extends SpellCardModel {
    constructor(props?: ConsecrationModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Consecration",
                desc: "Deal *2* damage to all enemies.",
                flavorDesc: "Consecrated ground glows with Holy energy. But it smells a little, too.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                effects: props.child?.effects ?? [new ConsecrationEffectModel()],
                ...props.child
            }
        });
    }
}

