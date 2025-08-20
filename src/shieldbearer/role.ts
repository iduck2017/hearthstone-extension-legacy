import { AttackModel, HealthModel, RoleModel, TauntModel } from "hearthstone-core";

export class ShieldbearerRoleModel extends RoleModel {
    constructor(props: ShieldbearerRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                attack: new AttackModel({ state: { origin: 0 }}),
                health: new HealthModel({ state: { origin: 4 }}),   
                taunt: new TauntModel({ state: { isActive: true }}),
                ...props.child 
            },
            refer: { ...props.refer }
        });
    }
} 