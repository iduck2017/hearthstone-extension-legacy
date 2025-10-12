/**
 * Focused Will
 * 
 * Extreme focus is almost as effective as a really flashy distraction.
 * 
 * Silence a minion, then give it +3 Health.
 * 
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Priest
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Dave Greco
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeaturesModel } from "hearthstone-core";
import { FocusedWillEffectModel } from "./effect";

@LibraryUtil.is('focused-will')
export class FocusedWillModel extends SpellCardModel {
    constructor(props?: FocusedWillModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Focused Will",
                desc: "Silence a minion, then give it +3 Health.",
                flavorDesc: "Extreme focus is almost as effective as a really flashy distraction.",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.PRIEST,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new SpellFeaturesModel({
                    child: { effects: [new FocusedWillEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}
