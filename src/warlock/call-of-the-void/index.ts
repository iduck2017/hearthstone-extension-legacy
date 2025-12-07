/**
 * Call of the Void
 *
 * "Marco!" "Polo!" "Marco!" "Who dares summon me?!"
 *
 * Add a random Demon to your hand.
 *
 * Type: Spell
 * Rarity: Common
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Arthur Gimaldinov
 * Collectible
 *
 * 1 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { CallOfTheVoidEffectModel } from "./effect";

@LibraryService.is('call-of-the-void')
export class CallOfTheVoidModel extends SpellCardModel {
    constructor(props?: CallOfTheVoidModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Call of the Void",
                desc: "Add a random Demon to your hand.",
                flavorDesc: "\"Marco!\" \"Polo!\" \"Marco!\" \"Who dares summon me?!\"",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.WARLOCK,
                schools: [SchoolType.SHADOW],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                effects: props.child?.effects ?? [new CallOfTheVoidEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

