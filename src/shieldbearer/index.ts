import { AttackModel, FeaturesModel, HealthModel, MinionCardModel, RaceType, RoleEntriesModel, RoleModel, TauntModel } from "hearthstone-core";

export class ShieldbearerModel extends MinionCardModel {
    constructor(props: ShieldbearerModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Shieldbearer',
                desc: 'Taunt',
                mana: 1,
                races: [RaceType.DRAENEI],
                ...props.state
            },
            child: {
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 0 }}),
                        health: new HealthModel({ state: { origin: 4 }}),  
                        entries: new RoleEntriesModel({
                            child: {
                                taunt: new TauntModel({})
                            }
                        })
                    },
                }),
                ...props.child,
            },
            refer: { ...props.refer }
        });
    }
} 