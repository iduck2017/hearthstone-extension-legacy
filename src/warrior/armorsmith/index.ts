/**
 * Armorsmith
 * 
 * She accepts guild funds for repairs!
 * 
 * Whenever a friendly minion takes damage, gain 1 Armor.
 * 
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Greg Hildebrandt
 * Collectible
 * 
 * 2 mana
 * 1/4
 */

import { ClassType, CostModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RoleHealthModel } from "hearthstone-core";
import { ArmorsmithFeatureModel } from "./feature";

@LibraryUtil.is('armorsmith')
export class ArmorsmithModel extends MinionCardModel {
    constructor(props?: ArmorsmithModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Armorsmith",
                desc: "Whenever a friendly minion takes damage, gain 1 Armor.",
                flavorDesc: "She accepts guild funds for repairs!",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARRIOR,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 1 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 4 }}),
                feats: props.child?.feats ?? [new ArmorsmithFeatureModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

