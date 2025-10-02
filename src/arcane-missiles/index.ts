/**
 * Arcane Missiles
 * 
 * You'd think you'd be able to control your missiles a little better since you're a powerful mage and all.
 * 
 * Deal 3 damage randomly split among all enemies.
 * 
 * Type: Spell
 * Spell School: Arcane
 * Rarity: Free
 * Set: Legacy
 * Class: Mage
 * Artist: Warren Mahy
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { ArcaneMissilesEffectModel } from "./effect";

@LibraryUtil.is('arcane-missiles')
export class ArcaneMissilesModel extends SpellCardModel {
    constructor(loader?: Loader<ArcaneMissilesModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Arcane Missiles",
                    desc: "Deal 3 damage randomly split among all enemies.",
                    flavorDesc: "You'd think you'd be able to control your missiles a little better since you're a powerful mage and all.",
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.MAGE,
                    schools: [SchoolType.ARCANE],
                    ...props.state
                },
                refer: { ...props.refer },
                child: { 
                    cost: props.child?.cost ?? new CostModel(() => ({ state: { current: 1 }})),
                    effects: props.child?.effects ?? [new ArcaneMissilesEffectModel()],
                    ...props.child 
                }
            }
        })
    }
} 