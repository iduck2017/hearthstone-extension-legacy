/**
 * Spellbender 3
 * While it's fun to intercept enemy lightning bolts, a spellbender much prefers to intercept opposing Marks of the Wild. It just feels meaner. And blood elves... well, they're a little mean.
 * 
 * Secret: When an enemy casts a spell on a minion, summon a 1/3 as the new target.
 * 
 * Type: Spell
 * Rarity: Epic
 * Set: Legacy
 * Class: Mage
 * Cost to Craft: 400 / 1600 (Golden)
 * Disenchanting Yield: 100 / 400 (Golden)
 * Artist: Gonzalo Ordonez
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SecretCardModel, SpellFeatsModel } from "hearthstone-core";
import { SpellbenderFeatureModel } from "./feature";

@LibraryUtil.is('spellbender')
export class SpellbenderModel extends SecretCardModel {
    constructor(props?: SpellbenderModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { 
                name: "Spellbender",
                desc: "Secret: When an enemy casts a spell on a minion, summon a 1/3 as the new target.",
                flavorDesc: "While it's fun to intercept enemy lightning bolts, a spellbender much prefers to intercept opposing Marks of the Wild. It just feels meaner. And blood elves... well, they're a little mean.",
                isCollectible: true,
                rarity: RarityType.EPIC,
                class: ClassType.MAGE,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                feats: new SpellFeatsModel({
                    child: {
                        list: [new SpellbenderFeatureModel()]
                    }
                }),
                ...props.child 
            }
        })
    }
}
