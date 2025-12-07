/**
 * Wild Growth
 * 
 * Grow your own mana crystals with this Mana Crystal Growth Kit, only 39.99!
 * 
 * Gain an empty Mana Crystal.
 * 
 * Type: Spell
 * Spell School: Nature
 * Rarity: Common
 * Set: Legacy
 * Class: Druid
 * Artist: James Ryman
 * Collectible
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { WildGrowthEffectModel } from "./effect";

@LibraryService.is('wild-growth')
export class WildGrowthModel extends SpellCardModel {
    constructor(props?: WildGrowthModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Wild Growth",
                desc: "Gain an empty Mana Crystal.",
                flavorDesc: "Grow your own mana crystals with this Mana Crystal Growth Kit, only 39.99!",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.DRUID,
                schools: [SchoolType.NATURE],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new WildGrowthEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

