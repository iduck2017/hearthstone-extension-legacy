import { AttackModel, ClassType, HealthModel, MinionModel,RarityType,  RaceType, RoleEntriesModel, RoleModel, RushModel, RushStatus } from "hearthstone-core";

export class EmeraldSkytalonModel extends MinionModel {
    constructor(props: EmeraldSkytalonModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Emerald Skytalon',
                desc: 'Rush',
                mana: 1,
                races: [RaceType.BEAST, RaceType.ELEMENTAL],
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
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
                                    state: { status: RushStatus.ACTIVE }
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