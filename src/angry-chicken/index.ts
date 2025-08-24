import { AttackModel, CardModel, ClassType, FeaturesModel, HealthModel, MinionModel, RaceType, RarityType, RoleModel } from "hearthstone-core";
import { AngryChickenFeatureModel } from "./feature";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('angry-chicken')
export class AngryChickenModel extends CardModel {
    constructor(props: AngryChickenModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Angry Chicken',
                desc: '+5 Attack while damaged.',
                isCollectible: true,
                flavorDesc: 'There is no beast more frightening (or ridiculous) than a fully enraged chicken.',
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.BEAST] },
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 1 }}), 
                        features: new FeaturesModel({
                            child: { items: [
                                new AngryChickenFeatureModel({})
                            ]}
                        })  
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}
