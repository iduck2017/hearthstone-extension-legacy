/**
 * Execute
 * 
 * It's okay, he deserved it.
 * 
 * Destroy a damaged enemy minion.
 * 
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Dany Orizio
 * Collectible
 * 
 * 1 mana
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel } from "hearthstone-core";
import { ExecuteEffectModel } from "./effect";

@LibraryUtil.is('execute')
export class ExecuteModel extends SpellCardModel {
    constructor(props?: ExecuteModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Execute",
                desc: "Destroy a damaged enemy minion.",
                flavorDesc: "It's okay, he deserved it.",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARRIOR,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                effects: props.child?.effects ?? [new ExecuteEffectModel()],
                ...props.child
            }
        });
    }
}

