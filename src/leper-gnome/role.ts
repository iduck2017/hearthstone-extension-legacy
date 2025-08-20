import { HealthModel, AttackModel, RoleModel } from "hearthstone-core";

export class LeperGnomeRoleModel extends RoleModel {
    constructor(props: LeperGnomeRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                health: new HealthModel({ state: { origin: 1 }}),
                attack: new AttackModel({ state: { origin: 2 }}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }

}