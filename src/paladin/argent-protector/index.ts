/**
 * Argent Protector
 * 
 * "I'm not saying you can dodge fireballs. I'm saying with this shield, you won't have to."
 * 
 * Battlecry: Give a friendly minion Divine Shield.
 * 
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Paladin
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Doug Alexander
 * Collectible
 * 
 * 2 mana 3/2
 */

import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";
import { ArgentProtectorBattlecryModel } from "./battlecry";

@LibraryService.is('argent-protector')
export class ArgentProtectorModel extends MinionCardModel {
    constructor(props?: ArgentProtectorModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Argent Protector',
                desc: 'Battlecry: Give a friendly minion Divine Shield.',
                flavorDesc: '"I\'m not saying you can dodge fireballs. I\'m saying with this shield, you won\'t have to."',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PALADIN,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 3 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 2 }}),
                battlecry: props.child?.battlecry ?? [new ArgentProtectorBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

