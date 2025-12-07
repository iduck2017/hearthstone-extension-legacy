/**
 * Savagery
 * 
 * It is true that some druids are savage, but others still enjoy a quiet moment and a spot of tea.
 * 
 * Deal damage equal to your hero's Attack to a minion.
 * 
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Druid
 * Artist: Dave Rapoza
 * Collectible
 */

import { ClassType, CostModel, LibraryService, RarityType, SpellCardModel,  } from "hearthstone-core";
import { SavageryEffectModel } from "./effect";

@LibraryService.is('savagery')
export class SavageryModel extends SpellCardModel {
    constructor(props?: SavageryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Savagery",
                desc: "Deal damage equal to your hero's Attack to a minion.",
                flavorDesc: "It is true that some druids are savage, but others still enjoy a quiet moment and a spot of tea.",
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
                    child: { effects: [new SavageryEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

