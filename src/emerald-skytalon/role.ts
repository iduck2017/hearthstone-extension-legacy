import { AttackModel, HealthModel, RaceType, RoleModel, RushModel, RushStatus } from "hearthstone-core";

export class EmeraldSkytalonRoleModel extends RoleModel {
    constructor(props: EmeraldSkytalonRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                attack: new AttackModel({ state: { origin: 2 }}),
                health: new HealthModel({ state: { origin: 1 }}),   
                rush: new RushModel({ state: { isActive: RushStatus.ACTIVE }}),
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }
}