import { AttackModel, HealthModel, RoleModel } from "hearthstone-core";
import { ChargeModel } from "hearthstone-core/dist/type/model/features/charge";

export class StonetuskBoarRoleModel extends RoleModel {
    constructor(props: StonetuskBoarRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                attack: new AttackModel({ state: { origin: 1 }}),
                health: new HealthModel({ state: { origin: 1 }}),
                charge: new ChargeModel({ state: { isActive: true }}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}