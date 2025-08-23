import { AttackModel, ClassType, FeaturesModel, HealthModel, MinionModel, RaceType, RarityType, RoleModel } from "hearthstone-core";
import { MurlocTidecallerFeatureModel } from "./feature";

export class MurlocTidecallerModel extends MinionModel {
    constructor(props: MurlocTidecallerModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Tidecaller',
                desc: 'Whenever your summon a Murloc, gain +1 Attack.',
                mana: 1,
                races: [RaceType.MURLOC],
                flavorDesc: '',
                rarity: RarityType.RARE,
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
                                items: [new MurlocTidecallerFeatureModel({})]
                            }
                        })
                    },
                })
            },
            refer: { ...props.refer }
        });
    }
}