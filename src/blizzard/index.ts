/**
 * Blizzard 6
 * This spell can be very Entertaining.
 * 
 * Deal 2 damage to all enemy minions and Freeze them.
 * 
 * Type: Spell
 * Spell School: Frost
 * Rarity: Rare
 * Set: Legacy
 * Class: Mage
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Chris Seaman
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeatsModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { BlizzardEffectModel } from "./effect";

@LibraryUtil.is('blizzard')
export class BlizzardModel extends SpellCardModel {
    constructor(loader?: Loader<BlizzardModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Blizzard",
                    desc: "Deal 2 damage to all enemy minions and Freeze them.",
                    flavorDesc: "This spell can be very Entertaining.",
                    isCollectible: true,
                    rarity: RarityType.RARE,
                    class: ClassType.MAGE,
                    schools: [SchoolType.FROST],
                    ...props.state
                },
                refer: { ...props.refer },
                child: { 
                    cost: props.child?.cost ?? new CostModel(() => ({ state: { origin: 6 }})),
                    feats: props.child?.feats ?? new SpellFeatsModel(() => ({
                        child: {
                            effects: [new BlizzardEffectModel()]
                        }
                    })),
                    ...props.child 
                }
            }
        })
    }
}
