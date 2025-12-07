/**
 * Jaina's Gift
 * 
 * "On this day, my magic will bring us together." -Jaina
 * 
 * Discover a Temporary Frostbolt, Arcane Intellect, or Fireball.
 * 
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Mage
 * Artist: Melvin Chan
 * Collectible
 */

import { ClassType, CostModel, LibraryService, RarityType, SpellCardModel } from "hearthstone-core";
import { JainasGiftEffectModel } from "./effect";

@LibraryService.is('jainas-gift')
export class JainasGiftModel extends SpellCardModel {
    constructor(props?: JainasGiftModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Jaina's Gift",
                desc: "Discover a Temporary Frostbolt, Arcane Intellect, or Fireball.",
                flavorDesc: "\"On this day, my magic will bring us together.\" -Jaina",
                collectible: true,
                rarity: RarityType.RARE,
                class: ClassType.MAGE,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                effects: props.child?.effects ?? [new JainasGiftEffectModel()],
                ...props.child 
            }
        })
    }
}

