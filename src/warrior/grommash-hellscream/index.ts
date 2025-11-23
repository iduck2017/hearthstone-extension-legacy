/**
 * Grommash Hellscream
 * 
 * Grommash drank the tainted blood of Mannoroth, dooming the orcs to green skin and red eyes! Maybe not his best decision.
 * 
 * Charge. Has +6 Attack while damaged.
 * 
 * Type: Minion
 * Rarity: Legendary
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 1600 / 3200 (Golden)
 * Disenchanting Yield: 400 / 1600 (Golden)
 * Artist: Glenn Rane
 * Collectible
 * 
 * 8 mana
 * 4/9
 */

import { ChargeModel, RoleHealthModel, RoleAttackModel, MinionCardModel, ClassType, RarityType, CostModel, LibraryUtil } from "hearthstone-core";
import { GrommashHellscreamFeatureModel } from "./feature";

@LibraryUtil.is('grommash-hellscream')
export class GrommashHellscreamModel extends MinionCardModel {
    constructor(props?: GrommashHellscreamModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Grommash Hellscream",
                desc: "Charge. Has +6 Attack while damaged.",
                isCollectible: true,
                flavorDesc: "Grommash drank the tainted blood of Mannoroth, dooming the orcs to green skin and red eyes! Maybe not his best decision.",
                rarity: RarityType.LEGENDARY,
                class: ClassType.WARRIOR,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 8 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 4 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 9 }}),
                charge: props.child?.charge ?? new ChargeModel({ state: { isEnabled: true } }),
                feats: props.child?.feats ?? [new GrommashHellscreamFeatureModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

