import { MinionModel, FeatureModel, RoleModel, AttackModel, HealthModel, CardHooksModel, RarityType, ClassType } from "hearthstone-core";
import { AbusiveSergeantBattlecryModel } from "./battlecry";
import { CostModel } from "hearthstone-core";

export class AbusiveSergeantModel extends MinionModel {
    constructor(props: AbusiveSergeantModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant',
                desc: 'Battlecry: Give a minion +2 Attack this turn.',
                races: [],
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
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