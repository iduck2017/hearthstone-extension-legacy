/**
 * Heroic Strike
 * 
 * Really, if you're a hero, this is every strike.
 * 
 * Give your hero +4 Attack this turn.
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
 * 2 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SpellCardModel } from "hearthstone-core";
import { HeroicStrikeEffectModel } from "./effect";

@LibraryService.is('heroic-strike')
export class HeroicStrikeModel extends SpellCardModel {
    constructor(props?: HeroicStrikeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Heroic Strike",
                desc: "Give your hero +4 Attack this turn.",
                flavorDesc: "Really, if you're a hero, this is every strike.",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARRIOR,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                effects: props.child?.effects ?? [new HeroicStrikeEffectModel()],
                ...props.child
            }
        });
    }
}

