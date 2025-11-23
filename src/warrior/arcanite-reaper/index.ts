/**
 * Arcanite Reaper
 * 
 * No… actually you should fear the Reaper.
 * 
 * Type: Weapon
 * Rarity: Rare
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Stefan Kopinski
 * Collectible
 * 
 * 5 mana 5/2
 */

import { ClassType, CostModel, WeaponActionModel, RarityType, WeaponAttackModel, WeaponCardModel, LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('arcanite-reaper')
export class ArcaniteReaperModel extends WeaponCardModel {
    constructor(props?: ArcaniteReaperModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Arcanite Reaper",
                desc: "",
                flavorDesc: "No… actually you should fear the Reaper.",
                class: ClassType.WARRIOR,
                rarity: RarityType.RARE,
                isCollectible: true,
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 5 }}),
                attack: new WeaponAttackModel({ state: { origin: 5 }}),
                action: new WeaponActionModel({ state: { origin: 2 }}),
                ...props.child
            },
            refer: { ...props.refer }
        })
    }
}

