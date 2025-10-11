/**
 * Water Elemental
 * 
 * Don't summon a water elemental at a party. It'll dampen the mood.
 * 
 * Freeze any character damaged by this minion.
 * 
 * Type: Minion
 * Minion Type: Elemental
 * Rarity: Free
 * Set: Legacy
 * Class: Mage
 * Artist: John Avon
 * Collectible
 * 4/3/6
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { WaterElementalFeatureModel } from "./feature";

@LibraryUtil.is('water-elemental')
export class WaterElementalModel extends MinionCardModel {
    constructor(props?: WaterElementalModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Water Elemental',
                desc: 'Freeze any character damaged by this minion.',
                flavorDesc: 'Don\'t summon a water elemental at a party. It\'ll dampen the mood.',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.MAGE,
                races: [RaceType.ELEMENTAL],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 4 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 3 }}),
                        health: new RoleHealthModel({ state: { origin: 6 }}),
                    }
                }),
                feats: props.child?.feats ?? new MinionFeatsModel({
                    child: { 
                        battlecry: [], 
                        feats: [new WaterElementalFeatureModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
