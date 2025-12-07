/*
 * Fiery War Axe
 * During times of tranquility and harmony, this weapon was called by its less popular name, Chilly Peace Axe.
 * 
 * Type: Weapon
 * Rarity: Free
 * Set: Legacy
 * Class: Warrior
 * Artist: Lucas Graciano
 * Collectible
 * 
 * 2/3/2
 */

import { ClassType, CostModel, WeaponActionModel, RarityType, WeaponAttackModel, WeaponCardModel, LibraryService } from "hearthstone-core";

@LibraryService.is('fiery-war-axe')
export class FieryWarAxeModel extends WeaponCardModel {
    constructor(props?: FieryWarAxeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Fiery War Axe",
                desc: "",
                flavorDesc: "During times of tranquility and harmony, this weapon was called by its less popular name, Chilly Peace Axe.",
                class: ClassType.WARRIOR,
                rarity: RarityType.COMMON,
                isCollectible: false,
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 2 }}),
                attack: new WeaponAttackModel({ state: { origin: 3 }}),
                action: new WeaponActionModel({ state: { origin: 2 }}),
                ...props.child
            },
            refer: { ...props.refer }
        })
    }
}
