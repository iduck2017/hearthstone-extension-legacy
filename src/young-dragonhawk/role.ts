import { AttackModel, HealthModel, RoleModel, WindfuryModel } from "hearthstone-core";

export class YoungDragonhawkRoleModel extends RoleModel {
    constructor(props: YoungDragonhawkRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                attack: new AttackModel({ state: { origin: 1 }}),
                health: new HealthModel({ state: { origin: 1 }}),
                windfury: new WindfuryModel({ state: { isActive: true }}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}