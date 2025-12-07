/**
 * Malfurion's Gift
 * 
 * "May this imbue you with the life of the party!" -Malfurion
 * 
 * Discover a Temporary Feral Rage, Wild Growth, or Swipe.
 * 
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Druid
 * Artist: Arthur Bozonnet
 * Collectible
 */

import { ClassType, CostModel, LibraryService, RarityType, SpellCardModel,  } from "hearthstone-core";
import { MalfurionsGiftEffectModel } from "./effect";

@LibraryService.is('malfurions-gift')
export class MalfurionsGiftModel extends SpellCardModel {
    constructor(props?: MalfurionsGiftModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Malfurion's Gift",
                desc: "Discover a Temporary Feral Rage, Wild Growth, or Swipe.",
                flavorDesc: "\"May this imbue you with the life of the party!\" -Malfurion",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.DRUID,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new MalfurionsGiftEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

