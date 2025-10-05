/**
 * Holy Smite
 * 
 * It doesn't matter how pious you are. Everyone needs a good smiting now and again.
 * 
 * Deal 3 damage to a minion.
 * 
 * Type: Spell
 * Spell School: Holy
 * Rarity: Free
 * Set: Legacy
 * Class: Priest
 * Artist: Steve Ellis
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { HolySmiteEffectModel } from "./effect";

@LibraryUtil.is('holy-smite')
export class HolySmiteModel extends SpellCardModel {
    constructor(loader?: Loader<HolySmiteModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Holy Smite",
                    desc: "Deal 3 damage to a minion.",
                    flavorDesc: "It doesn't matter how pious you are. Everyone needs a good smiting now and again.",
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.PRIEST,
                    schools: [SchoolType.HOLY],
                    ...props.state
                },
                refer: { ...props.refer },
                child: { 
                    cost: props.child?.cost ?? new CostModel(() => ({ state: { origin: 1 }})),
                    effects: props.child?.effects ?? [new HolySmiteEffectModel()],
                    ...props.child 
                }
            }
        })
    }
}
