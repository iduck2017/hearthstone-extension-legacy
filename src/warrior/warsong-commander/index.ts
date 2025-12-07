/**
 * Warsong Commander
 * 
 * The Warsong clan is such drama. It's really not worth it to become a commander.
 * 
 * Whenever you summon a minion with 3 or less Attack, give it Charge.
 * 
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Wei Wang
 * Collectible
 * 
 * 3 mana 2/3
 */

import { ClassType, CostModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, RoleHealthModel } from "hearthstone-core";
import { WarsongCommanderFeatureModel } from "./feature";

@LibraryService.is('warsong-commander')
export class WarsongCommanderModel extends MinionCardModel {
    constructor(props?: WarsongCommanderModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Warsong Commander",
                desc: "Whenever you summon a minion with 3 or less Attack, give it Charge.",
                flavorDesc: "The Warsong clan is such drama. It's really not worth it to become a commander.",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARRIOR,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                feats: props.child?.feats ?? [new WarsongCommanderFeatureModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

