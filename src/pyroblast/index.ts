/**
 * Pyroblast
 * Take the time for an evil laugh after you draw this card.
 * 
 * Deal 10 damage.
 * 
 * Type: Spell
 * Spell School: Fire
 * Rarity: Epic
 * Set: Legacy
 * Class: Mage
 * Cost to Craft: 400 / 1600 (Golden)
 * Disenchanting Yield: 100 / 400 (Golden)
 * Artist: Luca Zontini
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeatsModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { PyroblastEffectModel } from "./effect";

@LibraryUtil.is('pyroblast')
export class PyroblastModel extends SpellCardModel {
    constructor(loader?: Loader<PyroblastModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Pyroblast",
                    desc: "Deal 10 damage.",
                    flavorDesc: "Take the time for an evil laugh after you draw this card.",
                    isCollectible: true,
                    rarity: RarityType.EPIC,
                    class: ClassType.MAGE,
                    schools: [SchoolType.FIRE],
                    ...props.state
                },
                refer: { ...props.refer },
                child: {
                    cost: props.child?.cost ?? new CostModel(() => ({ state: { origin: 10 }})),
                    feats: props.child?.feats ?? new SpellFeatsModel(() => ({
                        child: { effects: [new PyroblastEffectModel()] }
                    })),
                    ...props.child
                }
            };
        });
    }
}
