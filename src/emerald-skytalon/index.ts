import { AttackModel, HealthModel, MinionCardModel, RaceType, RoleEntriesModel, RoleModel, RushModel, RushStatus } from "hearthstone-core";

export class EmeraldSkytalonModel extends MinionCardModel {
    constructor(props: EmeraldSkytalonModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Emerald Skytalon',
                desc: 'Rush',
                mana: 1,
                races: [RaceType.BEAST, RaceType.ELEMENTAL],
                ...props.state,
            },
            child: {
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 1 }}),   
                        entries: new RoleEntriesModel({
                            child: {
                                rush: new RushModel({ 
                                    state: { isActive: RushStatus.ACTIVE }
                                })
                            }
                        })  
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }
}