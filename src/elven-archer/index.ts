import { MinionCardModel, FeatureModel, HealthModel, AttackModel, RoleModel, CardHooksModel } from "hearthstone-core";
import { ElvenArcherBattlecryModel } from "./battlecry";

export class ElvenArcherModel extends MinionCardModel {
    constructor(props: ElvenArcherModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Elven Archer',
                desc: 'Battlecry: Deal 1 damage.',
                mana: 1,
                races: [],
                ...props.state,
            },
            child: {
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 1 }}),   
                    }
                }),
                hooks: new CardHooksModel({
                    child: { battlecry: [
                        new ElvenArcherBattlecryModel({})
                    ]}
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}