import { AttackModel, ClassType, HealthModel, MinionModel,RarityType,  RaceType, RoleEntriesModel, RoleModel, RushModel, RushStatus, CardModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";

export class EmeraldSkytalonModel extends CardModel {
    constructor(props: EmeraldSkytalonModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Emerald Skytalon',
                desc: 'Rush',
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.BEAST, RaceType.ELEMENTAL] },
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