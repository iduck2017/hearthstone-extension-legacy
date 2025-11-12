/**
 * Nourish
 * 
 * Druids take nourishment from many things: the power of nature, the songbird's chirp, a chocolate cake.
 * 
 * Choose One - Gain 2 Mana Crystals; or Draw 3 cards.
 * 
 * Type: Spell
 * Spell School: Nature
 * Rarity: Rare
 * Set: Legacy
 * Class: Druid
 * Artist: Terese Nielsen
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeaturesModel } from "hearthstone-core";
import { NourishEffectModel } from "./effect";

@LibraryUtil.is('nourish')
export class NourishModel extends SpellCardModel {
    constructor(props?: NourishModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Nourish",
                desc: "Choose One - Gain 2 Mana Crystals; or Draw 3 cards.",
                flavorDesc: "Druids take nourishment from many things: the power of nature, the songbird's chirp, a chocolate cake.",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.DRUID,
                schools: [SchoolType.NATURE],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 5 }}),
                feats: props.child?.feats ?? new SpellFeaturesModel({
                    child: { effects: [new NourishEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

