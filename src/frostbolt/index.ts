/**
 * Frostbolt
 * 
 * It is customary to yell "Chill out!" or "Freeze!" or "Ice ice, baby!" when you play this card.
 * 
 * Deal 3 damage to a character and Freeze it.
 * 
 * Type: Spell
 * Spell School: Frost
 * Rarity: Free
 * Set: Legacy
 * Class: Mage
 * Artist: Steve Ellis
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeaturesModel } from "hearthstone-core";
import { FrostboltEffectModel } from "./effect";

@LibraryUtil.is('frostbolt')
export class FrostboltModel extends SpellCardModel {
    constructor(props?: FrostboltModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Frostbolt",
                desc: "Deal 3 damage to a character and Freeze it.",
                flavorDesc: "It is customary to yell \"Chill out!\" or \"Freeze!\" or \"Ice ice, baby!\" when you play this card.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.MAGE,
                schools: [SchoolType.FROST],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                feats: props.child?.feats ?? new SpellFeaturesModel({
                    child: { effects: [new FrostboltEffectModel()] }
                }),
                ...props.child 
            }
        })
    }
} 