/**
 * Kor'kron Elite
 * 
 * The Kor'kron are the elite forces of Garrosh Hellscream. Let's just say you don't want to run into these guys while wearing a blue tabard.
 * 
 * Charge
 * 
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 * 
 * 4 mana
 * 4/3
 */

import { ChargeModel, RoleHealthModel, RoleAttackModel, MinionCardModel, ClassType, RarityType, CostModel, LibraryService } from "hearthstone-core";

@LibraryService.is('korkron-elite')
export class KorkronEliteModel extends MinionCardModel {
    constructor(props?: KorkronEliteModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Kor'kron Elite",
                desc: 'Charge',
                isCollectible: true,
                flavorDesc: "The Kor'kron are the elite forces of Garrosh Hellscream. Let's just say you don't want to run into these guys while wearing a blue tabard.",
                rarity: RarityType.RARE,
                class: ClassType.WARRIOR,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 4 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 4 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                charge: props.child?.charge ?? new ChargeModel({ state: { isEnabled: true } }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

