/**
 * Commanding Shout
 * 
 * "Shout! Shout! Let it all out!" - Advice to warriors-in-training
 * 
 * Your minions can't be reduced below 1 Health this turn. Draw a card.
 * 
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Wayne Reynolds
 * Collectible
 * 
 * 2 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SpellCardModel } from "hearthstone-core";
import { CommandingShoutEffectModel } from "./effect";

@LibraryService.is('commanding-shout')
export class CommandingShoutModel extends SpellCardModel {
    constructor(props?: CommandingShoutModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Commanding Shout",
                desc: "Your minions can't be reduced below 1 Health this turn. Draw a card.",
                flavorDesc: "\"Shout! Shout! Let it all out!\" - Advice to warriors-in-training",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARRIOR,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                effects: props.child?.effects ?? [new CommandingShoutEffectModel()],
                ...props.child
            }
        });
    }
}

