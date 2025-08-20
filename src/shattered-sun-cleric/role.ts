import { AttackModel, HealthModel, RoleModel } from "hearthstone-core";

export class ShatteredSunClericRoleModel extends RoleModel {
    constructor(props: ShatteredSunClericRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                attack: new AttackModel({ state: { origin: 3 }}),
                health: new HealthModel({ state: { origin: 2 }}),   
                ...props.child 
            },
            refer: { ...props.refer },
        });
    }
}