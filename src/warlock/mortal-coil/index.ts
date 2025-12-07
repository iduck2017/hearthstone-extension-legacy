/**
 * Mortal Coil
 *
 * If your spells look like horrifying skulls, let's be honest, you should get to draw some cards.
 *
 * Deal 1 damage to a minion. If that kills it, draw a card.
 *
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Matt Gaser
 * Collectible
 *
 * 1 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { MortalCoilEffectModel } from "./effect";

@LibraryService.is('mortal-coil')
export class MortalCoilModel extends SpellCardModel {
    constructor(props?: MortalCoilModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Mortal Coil",
                desc: "Deal 1 damage to a minion. If that kills it, draw a card.",
                flavorDesc: "If your spells look like horrifying skulls, let's be honest, you should get to draw some cards.",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARLOCK,
                schools: [SchoolType.SHADOW],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                effects: props.child?.effects ?? [new MortalCoilEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

