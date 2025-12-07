/**
 * Innervate
 * 
 * Some druids still have flashbacks from strangers yelling "Innervate me!!" at them.
 * 
 * Gain 1 Mana Crystal this turn only.
 * 
 * Type: Spell
 * Spell School: Nature
 * Rarity: Common
 * Set: Legacy
 * Class: Druid
 * Artist: Doug Alexander
 * Collectible
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { InnervateEffectModel } from "./effect";

@LibraryService.is('innervate')
export class InnervateModel extends SpellCardModel {
    constructor(props?: InnervateModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Innervate",
                desc: "Gain 1 Mana Crystal this turn only.",
                flavorDesc: "Some druids still have flashbacks from strangers yelling \"Innervate me!!\" at them.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.DRUID,
                schools: [SchoolType.NATURE],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 0 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new InnervateEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

