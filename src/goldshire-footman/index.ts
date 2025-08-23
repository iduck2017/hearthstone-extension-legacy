import { AttackModel, ClassType, HealthModel, MinionModel, RarityType, RoleEntriesModel, RoleModel, TauntModel } from "hearthstone-core";

export class GoldshireFootmanModel extends MinionModel {
    constructor(props: GoldshireFootmanModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Goldshire Footman',
                desc: 'Taunt',
                mana: 1,
                races: [],
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state
            },
            child: {
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 2 }}),   
                        entries: new RoleEntriesModel({
                            child: {
                                taunt: new TauntModel({})
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