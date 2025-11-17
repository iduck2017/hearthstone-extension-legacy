/**
 * Naturalize
 * 
 * Another one bites the dust.
 * 
 * Destroy a minion. Your opponent draws 2 cards.
 * 
 * Type: Spell
 * Spell School: Nature
 * Rarity: Common
 * Set: Legacy
 * Class: Druid
 * Artist: Leo Che
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeaturesModel } from "hearthstone-core";
import { NaturalizeEffectModel } from "./effect";

@LibraryUtil.is('naturalize')
export class NaturalizeModel extends SpellCardModel {
    constructor(props?: NaturalizeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Naturalize",
                desc: "Destroy a minion. Your opponent draws 2 cards.",
                flavorDesc: "Another one bites the dust.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.DRUID,
                schools: [SchoolType.NATURE],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new SpellFeaturesModel({
                    child: { effects: [new NaturalizeEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

