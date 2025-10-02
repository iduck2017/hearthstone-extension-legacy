/**
 * Cone of Cold 3
 * Magi of the Kirin Tor were casting Cubes of Cold for many years before Cones came into fashion some 90 years ago.
 * 
 * Freeze a minion and the minions next to it, and deal 1 damage to them.
 * 
 * Type: Spell
 * Spell School: Frost
 * Rarity: Common
 * Set: Legacy
 * Class: Mage
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Leo Che
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { ConeOfColdEffectModel } from "./effect";

@LibraryUtil.is('cone-of-cold')
export class ConeOfColdModel extends SpellCardModel {
    constructor(loader?: Loader<ConeOfColdModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Cone of Cold",
                    desc: "Freeze a minion and the minions next to it, and deal 1 damage to them.",
                    flavorDesc: "Magi of the Kirin Tor were casting Cubes of Cold for many years before Cones came into fashion some 90 years ago.",
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.MAGE,
                    schools: [SchoolType.FROST],
                    ...props.state
                },
                refer: { ...props.refer },
                child: { 
                    cost: props.child?.cost ?? new CostModel(() => ({ state: { current: 3 }})),
                    effects: props.child?.effects ?? [new ConeOfColdEffectModel()],
                    ...props.child 
                }
            }
        })
    }
}
