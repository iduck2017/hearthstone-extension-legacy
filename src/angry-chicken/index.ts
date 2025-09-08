/*
 * Angry Chicken
 * There is no beast more frightening (or ridiculous) than a fully enraged chicken.
 * +5 Attack while damaged.
 * Type: Minion
 * Minion Type: Beast
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Artist: Ben Thompson
 * Collectible
 */

import { AttackModel, ClassType, FeaturesModel, HealthModel, MinionCardModel, RaceType, RarityType, RoleModel, LibraryUtil, CostModel } from "hearthstone-core";
import { AngryChickenFeatureModel } from "./feature";
import { Loader } from "set-piece";

@LibraryUtil.is('angry-chicken')
export class AngryChickenModel extends MinionCardModel {
    constructor(loader?: Loader<AngryChickenModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Angry Chicken',
                    desc: '+5 Attack while damaged.',
                    isCollectible: true,
                    flavorDesc: 'There is no beast more frightening (or ridiculous) than a fully enraged chicken.',
                    rarity: RarityType.RARE,
                    class: ClassType.NEUTRAL,
                    races: [RaceType.BEAST],
                    ...props.state,
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 1 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new AttackModel(() => ({ state: { origin: 1 }})),
                            health: new HealthModel(() => ({ state: { origin: 1 }})), 
                            features: new FeaturesModel(() => ({
                                child: { items: [
                                    new AngryChickenFeatureModel()
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
