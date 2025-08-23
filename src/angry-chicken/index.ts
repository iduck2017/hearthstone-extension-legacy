import { AttackModel, ClassType, FeaturesModel, HealthModel, MinionModel, RaceType, RarityType, RoleModel } from "hearthstone-core";
import { AngryChickenFeatureModel } from "./feature";

export class AngryChickenModel extends MinionModel {
    constructor(props: AngryChickenModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Angry Chicken',
                desc: '+5 Attack while damaged.',
                mana: 1,
                races: [RaceType.BEAST],
                flavorDesc: '',
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                role: new RoleModel({
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
