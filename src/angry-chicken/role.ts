import { AttackModel, HealthModel, RoleModel } from "hearthstone-core";
import { AngryChickenFeatureModel } from "./feature";

export class AngryChickenRoleModel extends RoleModel {
    constructor(props: AngryChickenRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                attack: new AttackModel({ state: { origin: 1 }}),
                health: new HealthModel({ state: { origin: 1 }}),   
                ...props.child,
                features: [
                    ...props.child?.features ?? [],
                    new AngryChickenFeatureModel({})
                ]
            },
            refer: { ...props.refer },
        });
    }
}