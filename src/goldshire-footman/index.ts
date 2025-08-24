import { AttackModel, CardModel, ClassType, HealthModel, MinionModel, RarityType, RoleEntriesModel, RoleModel, TauntModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";

export class GoldshireFootmanModel extends CardModel {
    constructor(props: GoldshireFootmanModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Goldshire Footman',
                desc: 'Taunt',
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                minion: new MinionModel({
                    state: { races: [] },
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