import { AttackModel, FeaturesModel, HealthModel, MinionCardModel, RaceType, RoleModel } from "hearthstone-core";
import { MurlocTidecallerFeatureModel } from "./feature";

export class MurlocTidecallerCardModel extends MinionCardModel {
    constructor(props: MurlocTidecallerCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Tidecaller',
                desc: 'Whenever your summon a Murloc, gain +1 Attack.',
                mana: 1,
                races: [RaceType.MURLOC],
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