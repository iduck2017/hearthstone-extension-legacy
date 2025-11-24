import { FeatureModel, WeaponCardModel, WeaponActionModel, WeaponActionDecor, MinionCardModel, RoleActionModel, HeroModel } from "hearthstone-core";
import { StateUtil, Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('gorehowl-feature')
export class GorehowlFeatureModel extends FeatureModel {
    constructor(props?: GorehowlFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Gorehowl's feature",
                desc: "Attacking a minion costs 1 Attack instead of 1 Durability.",
                isEnabled: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    // TODO: Need to intercept weapon attack on minions and modify consumption
    // When attacking a minion, consume 1 Attack instead of 1 Durability
    // This may require listening to hero attack events and checking if target is a minion
    // Then modify weapon.action.consume() to reduce attack instead of durability
}

