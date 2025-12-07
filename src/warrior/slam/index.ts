/**
 * Slam
 * 
 * "Dun da dun, dun da dun": if you've heard an ogre sing this, it's too late.
 * 
 * Deal 2 damage to a minion. If it survives, draw a card.
 * 
 * Type: Spell
 * Rarity: Common
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: E. M. Gist
 * Collectible
 * 
 * 1 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SpellCardModel } from "hearthstone-core";
import { SlamEffectModel } from "./effect";

@LibraryService.is('slam')
export class SlamModel extends SpellCardModel {
    constructor(props?: SlamModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Slam",
                desc: "Deal 2 damage to a minion. If it survives, draw a card.",
                flavorDesc: "\"Dun da dun, dun da dun\": if you've heard an ogre sing this, it's too late.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.WARRIOR,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                effects: props.child?.effects ?? [new SlamEffectModel()],
                ...props.child
            }
        });
    }
}

