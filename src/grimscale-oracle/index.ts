import { HealthModel, AttackModel, RoleModel, RaceType, MinionModel, FeaturesModel, RarityType, ClassType, CardModel } from "hearthstone-core";
import { GrimscaleOracleFeatureModel } from "./feature";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('grimscale-oracle') 
export class GrimscaleOracleModel extends CardModel {
    constructor(props: GrimscaleOracleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Grimscale Oracle',
                desc: 'Your other Murlocs have +1 Attack.',
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.MURLOC] },
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