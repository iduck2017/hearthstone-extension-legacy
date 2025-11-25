/**
 * Ashbringer
 *
 * The blade of the Highlord.
 *
 * Type: Weapon
 * Rarity: Legendary
 * Set: Legacy
 * Class: Paladin
 * Artist: Alex Horley
 * Not Collectible
 *
 * 5/3
 */

import { ClassType, CostModel, WeaponActionModel, WeaponAttackModel, WeaponCardModel, LibraryUtil, RarityType } from "hearthstone-core";

@LibraryUtil.is('ashbringer')
export class AshbringerModel extends WeaponCardModel {
    constructor(props?: AshbringerModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Ashbringer",
                desc: "",
                flavorDesc: "The blade of the Highlord.",
                class: ClassType.PALADIN,
                rarity: RarityType.LEGENDARY,
                isCollectible: false,
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 0 }}),
                attack: new WeaponAttackModel({ state: { origin: 5 }}),
                action: new WeaponActionModel({ state: { origin: 3 }}),
                ...props.child
            },
            refer: { ...props.refer }
        })
    }
}

