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

import { MinionCardModel, HealthModel, RoleAttackModel, RoleModel, RaceType, FeaturesModel, RarityType, ClassType, LibraryUtil, CostModel } from "hearthstone-core";
import { GrimscaleOracleFeatureModel } from "./feature";
import { Loader } from "set-piece";

@LibraryUtil.is('grimscale-oracle') 
export class GrimscaleOracleModel extends MinionCardModel {
    constructor(loader?: Loader<GrimscaleOracleModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
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
                    cost: new CostModel(() => ({ state: { origin: 1 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 1 }})),
                            health: new HealthModel(() => ({ state: { origin: 1 }})),   
                            features: new FeaturesModel(() => ({
                                child: {
                                    items: [new GrimscaleOracleFeatureModel()]
                                }
                            }))
                        }
                    })),
                    ...props.child,
                },
                refer: { ...props.refer }
            }
        });
    }
}