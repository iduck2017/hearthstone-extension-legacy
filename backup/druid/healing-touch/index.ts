/**
 * Healing Touch
 * 
 * 8 Health, no waiting.
 * 
 * Restore 8 Health.
 * 
 * Type: Spell
 * Spell School: Nature
 * Rarity: Common
 * Set: Legacy
 * Class: Druid
 * Artist: Cyril Van Der Haegen
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeaturesModel } from "hearthstone-core";
import { HealingTouchEffectModel } from "./effect";

@LibraryUtil.is('healing-touch')
export class HealingTouchModel extends SpellCardModel {
    constructor(props?: HealingTouchModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Healing Touch",
                desc: "Restore 8 Health.",
                flavorDesc: "8 Health, no waiting.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.DRUID,
                schools: [SchoolType.NATURE],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                feats: props.child?.feats ?? new SpellFeaturesModel({
                    child: { effects: [new HealingTouchEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

