/**
 * Moonfire
 * 
 * "Cast Moonfire, and never stop." - How to Be a Druid, Chapter 5, Section 3
 * 
 * Deal 1 damage.
 * 
 * Type: Spell
 * Spell School: Arcane
 * Rarity: Common
 * Set: Legacy
 * Class: Druid
 * Artist: Richard Wright
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeaturesModel } from "hearthstone-core";
import { MoonfireEffectModel } from "./effect";

@LibraryUtil.is('moonfire')
export class MoonfireModel extends SpellCardModel {
    constructor(props?: MoonfireModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Moonfire",
                desc: "Deal 1 damage.",
                flavorDesc: "\"Cast Moonfire, and never stop.\" - How to Be a Druid, Chapter 5, Section 3",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.DRUID,
                schools: [SchoolType.ARCANE],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 0 }}),
                feats: props.child?.feats ?? new SpellFeaturesModel({
                    child: { effects: [new MoonfireEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

