/**
 * Mortal Strike
 * 
 * "If you only use one ability, use Mortal Strike." - The Warrior Code, Line 6
 * 
 * Deal 4 damage. If you have 12 or less Health, deal 6 instead.
 * 
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Zoltan & Gabor
 * Collectible
 * 
 * 4 mana
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel } from "hearthstone-core";
import { MortalStrikeEffectModel } from "./effect";

@LibraryUtil.is('mortal-strike')
export class MortalStrikeModel extends SpellCardModel {
    constructor(props?: MortalStrikeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Mortal Strike",
                desc: "Deal 4 damage. If you have 12 or less Health, deal 6 instead.",
                flavorDesc: "\"If you only use one ability, use Mortal Strike.\" - The Warrior Code, Line 6",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARRIOR,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 4 }}),
                effects: props.child?.effects ?? [new MortalStrikeEffectModel()],
                ...props.child
            }
        });
    }
}

