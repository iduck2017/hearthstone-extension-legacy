/**
 * Arathi Weaponsmith
 * 
 * 50% off fist weapons, limited time only!
 * 
 * Battlecry: Equip a 2/2 weapon.
 * 
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Samwise
 * Collectible
 * 
 * 4 mana 3/3
 */

import { ClassType, CostModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RoleHealthModel } from "hearthstone-core";
import { ArathiWeaponsmithBattlecryModel } from "./battlecry";

@LibraryUtil.is('arathi-weaponsmith')
export class ArathiWeaponsmithModel extends MinionCardModel {
    constructor(props?: ArathiWeaponsmithModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Arathi Weaponsmith",
                desc: "Battlecry: Equip a 2/2 weapon.",
                flavorDesc: "50% off fist weapons, limited time only!",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.WARRIOR,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 4 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 3 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                battlecry: props.child?.battlecry ?? [new ArathiWeaponsmithBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

