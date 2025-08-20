import { AttackModel, HealthModel, RoleModel } from "hearthstone-core";

export class LightwardenRoleModel extends RoleModel {
    constructor(props: LightwardenRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                attack: new AttackModel({ state: { origin: 1 }}),
                health: new HealthModel({ state: { origin: 2 }}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}   