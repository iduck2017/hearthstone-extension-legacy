import { AttackModel, HealthModel, RoleModel } from "hearthstone-core";

export class VoodooDoctorRoleModel extends RoleModel {
    constructor(props: VoodooDoctorRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                attack: new AttackModel({ state: { origin: 2 }}),
                health: new HealthModel({ state: { origin: 1 }}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}