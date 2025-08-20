import { AttackModel, HealthModel, RoleModel } from "hearthstone-core";

export class WispRoleModel extends RoleModel {
    constructor(props: WispRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                attack: new AttackModel({ state: { origin: 1 }}),
                health: new HealthModel({ state: { origin: 1 }}),   
                ...props.child 
            },
            refer: { ...props.refer },
        });
    }
}