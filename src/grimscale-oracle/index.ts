import { HealthModel, AttackModel, RoleModel, RaceType, MinionCardModel, FeaturesModel } from "hearthstone-core";
import { GrimscaleOracleFeatureModel } from "./feature";

export class GrimscaleOracleModel extends MinionCardModel {
    constructor(props: GrimscaleOracleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Grimscale Oracle',
                desc: 'Your other Murlocs have +1 Attack.',
                mana: 1,
                races: [RaceType.MURLOC],
                ...props.state
            },
            child: {
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 1 }}),   
                        features: new FeaturesModel({
                            child: {
                                items: [ new GrimscaleOracleFeatureModel({}) ]
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