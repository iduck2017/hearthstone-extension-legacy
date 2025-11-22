/**
 * Mark of the Wild
 * 
 * Not to be confused with Jim of the Wild.
 * 
 * Give a minion Taunt and +2/+3. (+2 Attack/+3 Health)
 * 
 * Type: Spell
 * Spell School: Nature
 * Rarity: Common
 * Set: Legacy
 * Class: Druid
 * Artist: Brad Vancata
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { MarkOfTheWildEffectModel } from "./effect";

@LibraryUtil.is('mark-of-the-wild')
export class MarkOfTheWildModel extends SpellCardModel {
    constructor(props?: MarkOfTheWildModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Mark of the Wild",
                desc: "Give a minion Taunt and +2/+3.",
                flavorDesc: "Not to be confused with Jim of the Wild.",
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
                    child: { effects: [new MarkOfTheWildEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

