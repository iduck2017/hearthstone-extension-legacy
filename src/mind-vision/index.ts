/**
 * Mind Vision
 * 
 * I see what you did there.
 * 
 * Put a copy of a random card in your opponent's hand into your hand.
 * 
 * Type: Spell
 * Spell School: Shadow
 * Rarity: Free
 * Set: Legacy
 * Class: Priest
 * Artist: Michael Komarck
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeatsModel } from "hearthstone-core";
import { MindVisionEffectModel } from "./effect";

@LibraryUtil.is('mind-vision')
export class MindVisionModel extends SpellCardModel {
    constructor(props?: MindVisionModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Mind Vision",
                desc: "Put a copy of a random card in your opponent's hand into your hand.",
                flavorDesc: "I see what you did there.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PRIEST,
                schools: [SchoolType.SHADOW],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new SpellFeatsModel({
                    child: { effects: [new MindVisionEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}
