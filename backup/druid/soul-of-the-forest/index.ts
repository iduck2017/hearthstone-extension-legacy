/**
 * Soul of the Forest
 * 
 * "Reforestation" is suddenly a terrifying word.
 * 
 * Give your minions "Deathrattle: Summon a 2/2 Treant."
 * 
 * Type: Spell
 * Spell School: Nature
 * Rarity: Common
 * Set: Legacy
 * Class: Druid
 * Artist: Markus Erdt
 * Collectible
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { SoulOfTheForestEffectModel } from "./effect";

@LibraryService.is('soul-of-the-forest')
export class SoulOfTheForestModel extends SpellCardModel {
    constructor(props?: SoulOfTheForestModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Soul of the Forest",
                desc: "Give your minions \"Deathrattle: Summon a 2/2 Treant.\"",
                flavorDesc: "\"Reforestation\" is suddenly a terrifying word.",
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
                    child: { effects: [new SoulOfTheForestEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

