/*
 * Ancient Watcher
 * Why do its eyes seem to follow you as you walk by?
 * Can't attack.
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Richard Wright
 * Collectible
 */

import { RoleAttackModel, ClassType, FeaturesModel, HealthModel, MinionCardModel, RarityType, RoleModel, LibraryUtil, CostModel } from "hearthstone-core";
import { AncientWatcherFeatureModel } from "./feature";
import { Loader } from "set-piece";

@LibraryUtil.is('ancient-watcher')  
export class AncientWatcherModel extends MinionCardModel {
    constructor(loader?: Loader<AncientWatcherModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Ancient Watcher',
                    desc: 'Can\'t attack.',
                    isCollectible: true,
                    flavorDesc: 'Why do its eyes seem to follow you as you walk by?',
                    rarity: RarityType.RARE,
                    class: ClassType.NEUTRAL,
                    races: [],
                    ...props.state,
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 2 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 4 }})),
                            health: new HealthModel(() => ({ state: { origin: 5 }})), 
                            features: new FeaturesModel(() => ({
                                child: { items: [
                                    new AncientWatcherFeatureModel()
                                ]}
                            }))  
                        }
                    })),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        });
    }
} 