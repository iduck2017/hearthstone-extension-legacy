import { AttackModel, HealthModel, RoleModel } from "hearthstone-core";
import { GrimscaleOracleBuffModel } from "./buff";

export class GrimscaleOracleRoleModel extends RoleModel {
    constructor(props: GrimscaleOracleRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                attack: new AttackModel({ state: { origin: 1 }}),
                health: new HealthModel({ state: { origin: 1 }}),   
                ...props.child,
                features: [
                    ...props.child?.features ?? [],
                    new GrimscaleOracleBuffModel({})
                ]
            },
            refer: { ...props.refer }
        });
    }
}