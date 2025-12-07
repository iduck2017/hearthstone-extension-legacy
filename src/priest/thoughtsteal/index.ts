/**
 * Thoughtsteal
 * 
 * "What do you get when you cast Thoughtsteal on an Orc? Nothing!" - Tauren joke
 * 
 * Copy 2 cards in your opponent's deck and add them to your hand.
 * 
 * Type: Spell
 * Spell School: Shadow
 * Rarity: Common
 * Set: Legacy
 * Class: Priest
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Alex Garner
 * Collectible
 * 
 * 2 cost
 */

import { ClassType, CostModel, LibraryService, RarityType, SpellCardModel, SchoolType,  } from "hearthstone-core";
import { ThoughtstealEffectModel } from "./effect";

@LibraryService.is('thoughtsteal')
export class ThoughtstealModel extends SpellCardModel {
    constructor(props?: ThoughtstealModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Thoughtsteal',
                desc: 'Copy 2 cards in your opponent\'s deck and add them to your hand.',
                flavorDesc: '"What do you get when you cast Thoughtsteal on an Orc? Nothing!" - Tauren joke',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PRIEST,
                schools: [SchoolType.SHADOW],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 2 }}),
                effects: props.child?.effects ?? [new ThoughtstealEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
