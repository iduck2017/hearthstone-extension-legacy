/**
 * Fireball
 * 
 * This spell is useful for burning things. If you're looking for spells that toast things, or just warm them a little, you're in the wrong place.
 * 
 * Deal 6 damage.
 * 
 * Type: Spell
 * Spell School: Fire
 * Rarity: Free
 * Set: Legacy
 * Class: Mage
 * Artist: Ralph Horsley
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { FireballEffectModel } from "./effect";

@LibraryUtil.is('fireball')
export class FireballModel extends SpellCardModel {
    constructor(props?: FireballModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Fireball",
                desc: "Deal 6 damage.",
                flavorDesc: "This spell is useful for burning things. If you're looking for spells that toast things, or just warm them a little, you're in the wrong place.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.MAGE,
                schools: [SchoolType.FIRE],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 4 }}),
                effects: props.child?.effects ?? [new FireballEffectModel()],
                ...props.child 
            }
        })
    }
}