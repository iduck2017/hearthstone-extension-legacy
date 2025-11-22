/**
 * Battle Rage
 * 
 * "You won't like me when I'm angry."
 * 
 * Draw a card for each damaged friendly character.
 * 
 * Type: Spell
 * Rarity: Common
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 * 
 * 2 mana
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel } from "hearthstone-core";
import { BattleRageEffectModel } from "./effect";

@LibraryUtil.is('battle-rage')
export class BattleRageModel extends SpellCardModel {
    constructor(props?: BattleRageModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Battle Rage",
                desc: "Draw a card for each damaged friendly character.",
                flavorDesc: "\"You won't like me when I'm angry.\"",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.WARRIOR,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                effects: props.child?.effects ?? [new BattleRageEffectModel()],
                ...props.child
            }
        });
    }
}

