/*
 * Grimscale Oracle
 * These are the brainy murlocs. It turns out that doesn't mean much.
 * 
 * Your other Murlocs have +1 Attack.
 * 
 * Type: Minion
 * Minion Type: Murloc
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 */

import { MinionCardModel, RoleHealthModel, RoleAttackModel, RoleModel, RaceType, FeatureModel, RarityType, ClassType, LibraryUtil, CostModel, RoleFeatsModel } from "hearthstone-core";
import { GrimscaleOracleFeatureModel } from "./feature";

@LibraryUtil.is('grimscale-oracle') 
export class GrimscaleOracleModel extends MinionCardModel {
    constructor(props?: GrimscaleOracleModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Grimscale Oracle',
                desc: 'Your other Murlocs have +1 Attack.',
                isCollectible: true,
                flavorDesc: 'These are the brainy murlocs. It turns out that doesn\'t mean much.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.MURLOC],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 1 }}),
                        health: new RoleHealthModel({ state: { origin: 1 }}),   
                        feats: new RoleFeatsModel({
                            child: {
                                feats: [new GrimscaleOracleFeatureModel()]
                            }
                        })
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer }
        });
    }
}