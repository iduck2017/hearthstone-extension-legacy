import { AttackModel, CardModel, ClassType, HealthModel, MinionModel, RarityType, RoleEntriesModel, RoleModel, TauntModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('goldshire-footman')
export class GoldshireFootmanModel extends CardModel {
    constructor(props: GoldshireFootmanModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Goldshire Footman',
                desc: 'Taunt',
                flavorDesc: 'If 1/2 minions are all that is defending Goldshire, you would think it would have been overrun years ago.',
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