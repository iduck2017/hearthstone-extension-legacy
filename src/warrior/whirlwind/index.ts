/**
 * Whirlwind
 * 
 * The way to tell seasoned warriors from novice ones: the novices yell "wheeeee" while whirlwinding.
 * 
 * Deal 1 damage to ALL minions.
 * 
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Jonboy Meyers
 * Collectible
 * 
 * 1 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SpellCardModel } from "hearthstone-core";
import { WhirlwindEffectModel } from "./effect";

@LibraryService.is('whirlwind')
export class WhirlwindModel extends SpellCardModel {
    constructor(props?: WhirlwindModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Whirlwind",
                desc: "Deal 1 damage to ALL minions.",
                flavorDesc: "The way to tell seasoned warriors from novice ones: the novices yell \"wheeeee\" while whirlwinding.",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARRIOR,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                effects: props.child?.effects ?? [new WhirlwindEffectModel()],
                ...props.child
            }
        });
    }
}

