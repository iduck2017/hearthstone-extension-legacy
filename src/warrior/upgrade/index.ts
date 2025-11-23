/**
 * Upgrade!
 * 
 * Easily worth 50 DKP.
 * 
 * If you have a weapon, give it +1/+1. Otherwise equip a 1/3 weapon.
 * 
 * Type: Spell
 * Rarity: Rare
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Matt Cavotta
 * Collectible
 * 
 * 1 mana
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel } from "hearthstone-core";
import { UpgradeEffectModel } from "./effect";

@LibraryUtil.is('upgrade')
export class UpgradeModel extends SpellCardModel {
    constructor(props?: UpgradeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Upgrade!",
                desc: "If you have a weapon, give it +1/+1. Otherwise equip a 1/3 weapon.",
                flavorDesc: "Easily worth 50 DKP.",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARRIOR,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                effects: props.child?.effects ?? [new UpgradeEffectModel()],
                ...props.child
            }
        });
    }
}

