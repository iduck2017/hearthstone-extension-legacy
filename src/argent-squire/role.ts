import { AttackModel, DevineSheildModel, HealthModel, RoleModel } from "hearthstone-core";

export class ArgentSquireRoleModel extends RoleModel {
    public constructor(props: RoleModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                attack: new AttackModel({ state: { origin: 1 }}),
                health: new HealthModel({ state: { origin: 1 }}),   
                devineShield: new DevineSheildModel({ state: { isActive: true } }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}