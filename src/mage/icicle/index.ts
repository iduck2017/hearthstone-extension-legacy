/**
 * Icicle 2
 * 
 * This may appear weak at frost glance, but it's actually a very ice spell.
 * Deal 2 damage to a minion. If it's Frozen, draw a card.
 * 
 * Type: Spell
 * Spell School: Frost
 * Rarity: Epic
 * Set: Legacy
 * Class: Mage
 * Cost to Craft: 400 / 1600 (Golden)
 * Disenchanting Yield: 100 / 400 (Golden)
 * Artist: Arthur Gimaldinov
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeaturesModel } from "hearthstone-core";
import { IcicleEffectModel } from "./effect";

@LibraryUtil.is('icicle')
export class IcicleModel extends SpellCardModel {
    constructor(props?: IcicleModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Icicle",
                desc: "Deal 2 damage to a minion. If it's Frozen, draw a card.",
                flavorDesc: "This may appear weak at frost glance, but it's actually a very ice spell.",
                isCollectible: true,
                rarity: RarityType.EPIC,
                class: ClassType.MAGE,
                schools: [SchoolType.FROST],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                feats: props.child?.feats ?? new SpellFeaturesModel({
                    child: { effects: [new IcicleEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}
