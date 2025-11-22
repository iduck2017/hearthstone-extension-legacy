/**
 * Cruel Taskmaster
 * 
 * "I'm going to need you to come in on Sunday." - Cruel Taskmaster
 * 
 * Battlecry: Deal 1 damage to a minion and give it +2 Attack.
 * 
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Phroilan Gardner
 * Collectible
 * 
 * 2 mana 2/3
 */

import { ClassType, CostModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RoleHealthModel } from "hearthstone-core";
import { CruelTaskmasterBattlecryModel } from "./battlecry";

@LibraryUtil.is('cruel-taskmaster')
export class CruelTaskmasterModel extends MinionCardModel {
    constructor(props?: CruelTaskmasterModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Cruel Taskmaster",
                desc: "Battlecry: Deal 1 damage to a minion and give it +2 Attack.",
                flavorDesc: "\"I'm going to need you to come in on Sunday.\" - Cruel Taskmaster",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.WARRIOR,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                battlecry: props.child?.battlecry ?? [new CruelTaskmasterBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

