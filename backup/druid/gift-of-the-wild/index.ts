/**
 * Gift of the Wild
 * 
 * The gift that keeps on living.
 * 
 * Give your minions +2/+2 and Taunt.
 * 
 * Type: Spell
 * Spell School: Nature
 * Rarity: Common
 * Set: Legacy
 * Class: Druid
 * Artist: Zoltan Boros
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { GiftOfTheWildEffectModel } from "./effect";

@LibraryUtil.is('gift-of-the-wild')
export class GiftOfTheWildModel extends SpellCardModel {
    constructor(props?: GiftOfTheWildModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Gift of the Wild",
                desc: "Give your minions +2/+2 and Taunt.",
                flavorDesc: "The gift that keeps on living.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.DRUID,
                schools: [SchoolType.NATURE],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 8 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new GiftOfTheWildEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

