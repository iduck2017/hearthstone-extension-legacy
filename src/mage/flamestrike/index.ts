/**
 * Flamestrike
 * When the ground is on fire, you should not stop, drop, and roll.
 * 
 * Deal 5 damage to all enemy minions.
 * 
 * Type: Spell
 * Spell School: Fire
 * Rarity: Free
 * Set: Legacy
 * Class: Mage
 * Artist: Romain De Santi
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { FlamestrikeEffectModel } from "./effect";

@LibraryUtil.is('flamestrike')
export class FlamestrikeModel extends SpellCardModel {
    constructor(props?: FlamestrikeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Flamestrike",
                desc: "Deal 5 damage to all enemy minions.",
                flavorDesc: "When the ground is on fire, you should not stop, drop, and roll.",
                collectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.MAGE,
                schools: [SchoolType.FIRE],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 7 }}),
                effects: props.child?.effects ?? [new FlamestrikeEffectModel()],
                ...props.child
            }
        });
    }
}
