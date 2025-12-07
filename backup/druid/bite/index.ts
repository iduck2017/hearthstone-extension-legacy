/**
 * Bite
 * 
 * Chew your food!
 * 
 * Give your hero +4 Attack this turn. Gain 4 Armor.
 * 
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Druid
 * Artist: MAR Studio
 * Collectible
 */

import { ClassType, CostModel, LibraryService, RarityType, SpellCardModel,  } from "hearthstone-core";
import { BiteEffectModel } from "./effect";

@LibraryService.is('bite')
export class BiteModel extends SpellCardModel {
    constructor(props?: BiteModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Bite",
                desc: "Give your hero +4 Attack this turn. Gain 4 Armor.",
                flavorDesc: "Chew your food!",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.DRUID,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 4 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new BiteEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

