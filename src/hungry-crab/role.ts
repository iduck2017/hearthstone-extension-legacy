import { AttackModel, HealthModel, RoleModel } from "hearthstone-core";

export class HungryCrabRoleModel extends RoleModel {
    constructor(props: HungryCrabRoleModel['props']) {
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