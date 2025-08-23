import { AttackModel, HealthModel, MinionCardModel, RoleEntriesModel, RoleModel, TauntModel } from "hearthstone-core";

export class GoldshireFootmanModel extends MinionCardModel {
    constructor(props: GoldshireFootmanModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Goldshire Footman',
                desc: 'Taunt',
                mana: 1,
                races: [],
                ...props.state
            },
            child: {
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 2 }}),   
                        entries: new RoleEntriesModel({
                            child: {
                                taunt: new TauntModel({ state: { isActive: true }})
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