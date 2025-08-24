import { HealthModel, AttackModel, RaceType, FeaturesModel, RoleModel, MinionModel, ClassType, RarityType, CardModel } from "hearthstone-core";
import { LightwardenFeatureModel } from "./feature";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('lightwarden')
export class LightwardenModel extends CardModel {
    constructor(props: LightwardenModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Lightwarden',
                desc: 'Whenever a character is healed, gain +2 Attack.',
                isCollectible: true,
                flavorDesc: 'She’s smaller than her sisters Mediumwarden and Heavywarden.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.BEAST] },
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
