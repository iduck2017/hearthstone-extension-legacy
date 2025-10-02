/**
 * Frost Nova 3
 * Hey man, that's cold. Literally and metaphorically.
 * 
 * Freeze all enemy minions.
 * 
 * Type: Spell
 * Spell School: Frost
 * Rarity: Free
 * Set: Legacy
 * Class: Mage
 * Artist: Josh Tallman
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { FrostNovaEffectModel } from "./effect";

@LibraryUtil.is('frost-nova')
export class FrostNovaModel extends SpellCardModel {
    constructor(loader?: Loader<FrostNovaModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Frost Nova",
                    desc: "Freeze all enemy minions.",
                    flavorDesc: "Hey man, that's cold. Literally and metaphorically.",
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.MAGE,
                    schools: [SchoolType.FROST],
                    ...props.state
                },
                refer: { ...props.refer },
                child: { 
                    cost: props.child?.cost ?? new CostModel(() => ({ state: { origin: 3 }})),
                    effects: props.child?.effects ?? [new FrostNovaEffectModel()],
                    ...props.child 
                }
            }
        })
    }
}
