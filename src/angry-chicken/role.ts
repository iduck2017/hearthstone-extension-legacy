import { MinionRoleModel, FeatureModel, MinionRaceType } from "hearthstone-core";
import { AngryChickenEffectModel } from "./effect";

export class AngryChickenRoleModel extends MinionRoleModel {
    constructor(props: AngryChickenRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                attack: 1,
                health: 1,
                races: [MinionRaceType.BEAST],
                ...props.state,
            },
            child: {
                ...props.child,
                effect: FeatureModel.assign(
                    props.child?.effect,
                    new AngryChickenEffectModel({})
                ),
            },
            refer: { ...props.refer },
        });
    }
}