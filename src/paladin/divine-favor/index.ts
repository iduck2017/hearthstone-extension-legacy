/**
 * Divine Favor
 * 
 * This is not just a favor, but a divine one, like helping someone move a couch with a fold out bed!
 * 
 * Draw cards until you have as many in hand as your opponent.
 * 
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Paladin
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Lucas Graciano
 * Collectible
 * 
 * 3 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { DivineFavorEffectModel } from "./effect";

@LibraryService.is('divine-favor')
export class DivineFavorModel extends SpellCardModel {
    constructor(props?: DivineFavorModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Divine Favor",
                desc: "Draw cards until you have as many in hand as your opponent.",
                flavorDesc: "This is not just a favor, but a divine one, like helping someone move a couch with a fold out bed!",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                effects: props.child?.effects ?? [new DivineFavorEffectModel()],
                ...props.child
            }
        });
    }
}

