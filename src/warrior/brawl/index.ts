/**
 * Brawl
 * 
 * Do you know the first rule of Brawl Club?
 * 
 * Destroy all minions except one. (chosen randomly)
 * 
 * Type: Spell
 * Rarity: Epic
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 400 / 1600 (Golden)
 * Disenchanting Yield: 100 / 400 (Golden)
 * Artist: Wayne Reynolds
 * Collectible
 * 
 * 5 mana
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel } from "hearthstone-core";
import { BrawlEffectModel } from "./effect";

@LibraryUtil.is('brawl')
export class BrawlModel extends SpellCardModel {
    constructor(props?: BrawlModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Brawl",
                desc: "Destroy all minions except one. (chosen randomly)",
                flavorDesc: "Do you know the first rule of Brawl Club?",
                isCollectible: true,
                rarity: RarityType.EPIC,
                class: ClassType.WARRIOR,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 5 }}),
                effects: props.child?.effects ?? [new BrawlEffectModel()],
                ...props.child
            }
        });
    }
}

