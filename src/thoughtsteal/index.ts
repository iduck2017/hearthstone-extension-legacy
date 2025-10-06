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

import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel, SchoolType, SpellFeatsModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { ThoughtstealEffectModel } from "./effect";

@LibraryUtil.is('thoughtsteal')
export class ThoughtstealModel extends SpellCardModel {
    constructor(loader?: Loader<ThoughtstealModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
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
                    cost: new CostModel(() => ({ state: { origin: 2 }})),
                    feats: props.child?.feats ?? new SpellFeatsModel(() => ({
                        child: { effects: [new ThoughtstealEffectModel()] }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            };
        });
    }
}
