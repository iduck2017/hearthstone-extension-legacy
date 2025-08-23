import { MinionCardModel, FeatureModel, RoleModel, AttackModel, HealthModel, CardHooksModel } from "hearthstone-core";
import { AbusiveSergeantBattlecryModel } from "./battlecry";

export class AbusiveSergeantModel extends MinionCardModel {
    constructor(props: AbusiveSergeantModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant',
                desc: 'Battlecry: Give a minion +2 Attack this turn.',
                mana: 1,
                races: [],
                ...props.state,
            },
            child: {
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 1 }}),   
                    }
                }),
                hooks: new CardHooksModel({
                    child: { battlecry: [
                        new AbusiveSergeantBattlecryModel({})
                    ]}
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}