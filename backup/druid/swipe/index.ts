/**
 * Swipe
 * 
 * When a bear rears back and extends his arms, he's about to Swipe! ... or hug.
 * 
 * Deal 4 damage to an enemy and 1 damage to all other enemies.
 * 
 * Type: Spell
 * Rarity: Common
 * Set: Legacy
 * Class: Druid
 * Artist: Sean O'Daniels
 * Collectible
 */

import { ClassType, CostModel, LibraryService, RarityType, SpellCardModel,  } from "hearthstone-core";
import { SwipeEffectModel } from "./effect";

@LibraryService.is('swipe')
export class SwipeModel extends SpellCardModel {
    constructor(props?: SwipeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Swipe",
                desc: "Deal 4 damage to an enemy and 1 damage to all other enemies.",
                flavorDesc: "When a bear rears back and extends his arms, he's about to Swipe! ... or hug.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.DRUID,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new SwipeEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

