/**
 * Starfall
 * 
 * Is the sky falling? Yes. Yes it is.
 * 
 * Choose One - Deal 5 damage to a minion; or 2 damage to all enemy minions.
 * 
 * Type: Spell
 * Spell School: Arcane
 * Rarity: Rare
 * Set: Legacy
 * Class: Druid
 * Artist: Richard Wright
 * Collectible
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { StarfallEffectModel } from "./effect";

@LibraryService.is('starfall')
export class StarfallModel extends SpellCardModel {
    constructor(props?: StarfallModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Starfall",
                desc: "Choose One - Deal 5 damage to a minion; or 2 damage to all enemy minions.",
                flavorDesc: "Is the sky falling? Yes. Yes it is.",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.DRUID,
                schools: [SchoolType.ARCANE],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 5 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new StarfallEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

