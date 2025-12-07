/**
 * Warsong Outrider
 * 
 * When it comes to the Warsong clan, outriders are the insiders.
 * 
 * Rush
 * 
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Konstantin Turovec
 * Collectible
 * 
 * 4 mana 5/4
 */

import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, RushModel } from "hearthstone-core";

@LibraryService.is('warsong-outrider')
export class WarsongOutriderModel extends MinionCardModel {
    constructor(props?: WarsongOutriderModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Warsong Outrider",
                desc: "Rush",
                flavorDesc: "When it comes to the Warsong clan, outriders are the insiders.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.WARRIOR,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 4 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 5 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 4 }}),
                rush: props.child?.rush ?? new RushModel(),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

