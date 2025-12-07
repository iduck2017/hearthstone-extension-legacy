/**
 * Claw
 * 
 * The claw decides who will stay and who will go.
 * 
 * Give your hero +2 Attack this turn. Gain 2 Armor.
 * 
 * Type: Spell
 * Rarity: Common
 * Set: Legacy
 * Class: Druid
 * Artist: Dany Orizio
 * Collectible
 */

import { ClassType, CostModel, LibraryService, RarityType, SpellCardModel,  } from "hearthstone-core";
import { ClawEffectModel } from "./effect";

@LibraryService.is('claw')
export class ClawModel extends SpellCardModel {
    constructor(props?: ClawModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Claw",
                desc: "Give your hero +2 Attack this turn. Gain 2 Armor.",
                flavorDesc: "The claw decides who will stay and who will go.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.DRUID,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new ClawEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

