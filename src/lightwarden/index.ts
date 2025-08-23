import { HealthModel, AttackModel, RaceType, FeaturesModel, RoleModel, MinionCardModel } from "hearthstone-core";
import { LightwardenFeatureModel } from "./feature";

export class LightwardenCardModel extends MinionCardModel {
    constructor(props: LightwardenCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Lightwarden',
                desc: 'Whenever a character is healed, gain +2 Attack.',
                mana: 1,
                races: [RaceType.BEAST],
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
