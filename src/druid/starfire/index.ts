/**
 * Starfire
 * 
 * Balance is important to druids. This card is perfectly balanced.
 * 
 * Deal 5 damage. Draw a card.
 * 
 * Type: Spell
 * Spell School: Arcane
 * Rarity: Common
 * Set: Legacy
 * Class: Druid
 * Artist: Alex Horley Orlandelli
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeaturesModel } from "hearthstone-core";
import { StarfireEffectModel } from "./effect";

@LibraryUtil.is('starfire')
export class StarfireModel extends SpellCardModel {
    constructor(props?: StarfireModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Starfire",
                desc: "Deal 5 damage. Draw a card.",
                flavorDesc: "Balance is important to druids. This card is perfectly balanced.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.DRUID,
                schools: [SchoolType.ARCANE],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 6 }}),
                feats: props.child?.feats ?? new SpellFeaturesModel({
                    child: { effects: [new StarfireEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

