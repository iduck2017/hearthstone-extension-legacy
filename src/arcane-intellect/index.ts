/**
 * Arcane Intellect 3
 * Playing this card makes you SMARTER. And let's face it: we could all stand to be a little smarter.
 * 
 * Draw 2 cards.
 * 
 * Type: Spell
 * Spell School: Arcane
 * Rarity: Free
 * Set: Legacy
 * Class: Mage
 * Artist: Dave Berggren
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { ArcaneIntellectEffectModel } from "./effect";

@LibraryUtil.is('arcane-intellect')
export class ArcaneIntellectModel extends SpellCardModel {
    constructor(loader?: Loader<ArcaneIntellectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Arcane Intellect",
                    desc: "Draw 2 cards.",
                    flavorDesc: "Playing this card makes you SMARTER. And let's face it: we could all stand to be a little smarter.",
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.MAGE,
                    schools: [SchoolType.ARCANE],
                    ...props.state
                },
                refer: { ...props.refer },
                child: { 
                    cost: props.child?.cost ?? new CostModel(() => ({ state: { origin: 3 }})),
                    effects: props.child?.effects ?? [new ArcaneIntellectEffectModel()],
                    ...props.child 
                }
            }
        })
    }
}
