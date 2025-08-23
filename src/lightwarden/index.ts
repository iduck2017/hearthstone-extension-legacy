import { HealthModel, AttackModel, RaceType, FeaturesModel, RoleModel, MinionModel, ClassType, RarityType } from "hearthstone-core";
import { LightwardenFeatureModel } from "./feature";

export class LightwardenModel extends MinionModel {
    constructor(props: LightwardenModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Lightwarden',
                desc: 'Whenever a character is healed, gain +2 Attack.',
                mana: 1,
                races: [RaceType.BEAST],
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 2 }}),
                        features: new FeaturesModel({
                            child: {
                                items: [new LightwardenFeatureModel({})]
                            }
                        })
                    },
                }),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }

}
