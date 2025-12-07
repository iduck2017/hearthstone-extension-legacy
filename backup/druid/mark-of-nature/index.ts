/**
 * Mark of Nature
 * 
 * Druids call it the "Mark of Nature." Everyone else calls it "needing a bath."
 * 
 * Choose One - Give a minion +4 Attack; or +4 Health and Taunt.
 * 
 * Type: Spell
 * Spell School: Nature
 * Rarity: Common
 * Set: Legacy
 * Class: Druid
 * Artist: Clint Langley
 * Collectible
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { MarkOfNatureEffectModel } from "./effect";

@LibraryService.is('mark-of-nature')
export class MarkOfNatureModel extends SpellCardModel {
    constructor(props?: MarkOfNatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Mark of Nature",
                desc: "Choose One - Give a minion +4 Attack; or +4 Health and Taunt.",
                flavorDesc: "Druids call it the \"Mark of Nature.\" Everyone else calls it \"needing a bath.\"",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.DRUID,
                schools: [SchoolType.NATURE],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new MarkOfNatureEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

