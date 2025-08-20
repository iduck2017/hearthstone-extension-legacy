import { AttackModel, HealthModel, RoleModel, TauntModel } from "hearthstone-core";

export class GoldshireFootmanRoleModel extends RoleModel {
    constructor(props: GoldshireFootmanRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                attack: new AttackModel({ state: { origin: 1 }}),
                health: new HealthModel({ state: { origin: 2 }}),   
                taunt: new TauntModel({ state: { isActive: true }}),
                ...props.child 
            },
            refer: { ...props.refer }
        });
    }
}