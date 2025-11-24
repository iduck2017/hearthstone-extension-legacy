/**
 * Gorehowl
 * 
 * Grommash Hellscream's famous axe. Somehow this ended up in Prince Malchezaar's possession. Quite the mystery!
 * 
 * Attacking a minion costs 1 Attack instead of 1 Durability.
 * 
 * Type: Weapon
 * Rarity: Epic
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 400 / 1600 (Golden)
 * Disenchanting Yield: 100 / 400 (Golden)
 * Artist: Zoltan & Gabor
 * Collectible
 * 
 * 7 mana 7/1
 */

import { ClassType, CostModel, WeaponActionModel, RarityType, WeaponAttackModel, WeaponCardModel, LibraryUtil } from "hearthstone-core";
import { GorehowlFeatureModel } from "./feature";

@LibraryUtil.is('gorehowl')
export class GorehowlModel extends WeaponCardModel {
    constructor(props?: GorehowlModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Gorehowl",
                desc: "Attacking a minion costs 1 Attack instead of 1 Durability.",
                flavorDesc: "Grommash Hellscream's famous axe. Somehow this ended up in Prince Malchezaar's possession. Quite the mystery!",
                class: ClassType.WARRIOR,
                rarity: RarityType.EPIC,
                isCollectible: true,
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 7 }}),
                attack: new WeaponAttackModel({ state: { origin: 7 }}),
                action: new WeaponActionModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? [new GorehowlFeatureModel()],
                ...props.child
            },
            refer: { ...props.refer }
        })
    }
}

