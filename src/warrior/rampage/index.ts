/**
 * Rampage
 * 
 * Minion get ANGRY. Minion SMASH!
 * 
 * Give a damaged minion +3/+3.
 * 
 * Type: Spell
 * Rarity: Common
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Jonboy Meyers
 * Collectible
 * 
 * 2 mana
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel } from "hearthstone-core";
import { RampageEffectModel } from "./effect";

@LibraryUtil.is('rampage')
export class RampageModel extends SpellCardModel {
    constructor(props?: RampageModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Rampage",
                desc: "Give a damaged minion +3/+3.",
                flavorDesc: "Minion get ANGRY. Minion SMASH!",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.WARRIOR,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                effects: props.child?.effects ?? [new RampageEffectModel()],
                ...props.child
            }
        });
    }
}

