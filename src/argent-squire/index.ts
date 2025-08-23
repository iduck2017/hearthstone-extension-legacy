import { AttackModel, CardModel, DivineSheildModel, HealthModel, MinionCardModel, RoleEntriesModel, RoleModel } from "hearthstone-core";

export class ArgentSquireModel extends MinionCardModel {
    public constructor(props: CardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Argent Squire',
                desc: 'Divine Shield',
                mana: 1,
                races: [],
                ...props.state,
            },
            child: {
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 1 }}),   
                        entries: new RoleEntriesModel({ 
                            child: { 
                                divineShield: new DivineSheildModel({
                                    state: { isActive: true }
                                })
                            }
                        })
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}