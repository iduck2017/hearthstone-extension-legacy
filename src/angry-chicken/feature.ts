import { RoleAttackModel, FeatureModel, RoleHealthModel, RoleAttackDecor, OperatorType, RoleModel, MinionFeatureModel } from "hearthstone-core";
import { Event, EventUtil, StateUtil, TemplUtil, TranxUtil, Decor, Frame } from "set-piece";
import { DeepReadonly } from "utility-types";

export namespace AngryChickenFeatureModel {
    export type E = {};
    export type S = { offset: number };
    export type C = {};
    export type R = {}
}

@TemplUtil.is('angry-chicken-feature')
export class AngryChickenFeatureModel extends MinionFeatureModel<
    AngryChickenFeatureModel.E,
    AngryChickenFeatureModel.S,
    AngryChickenFeatureModel.C,
    AngryChickenFeatureModel.R
> {
    constructor(props?: AngryChickenFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Angry Chicken\'s Buff',
                desc: 'Has +5 Attack while damaged.',
                offset: 5,
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }


    // Listen to health state changes to trigger enrage effect
    @EventUtil.on(self => self.handleChange)
    private listenChange() {
        return this.route.role?.proxy.child.health.event?.onChange
    }
    @TranxUtil.span()
    private handleChange(that: RoleHealthModel, event: Event<Frame<RoleHealthModel>>) {
        if (that.state.current !== event.detail.state.current) this.reload()
        if (that.state.maximum !== event.detail.state.maximum) this.reload()
    }

    // Apply attack buff when damaged
    @StateUtil.on(self => self.modifyAttack)
    private listenAttack() {
        return this.route.role?.proxy.child.attack.decor
    }
    private modifyAttack(
        that: RoleAttackModel,
        decor: RoleAttackDecor
    ) {
        const role = that.route.role;
        if (!role) return;

        const health = role.child.health;
        const isEnrage = health.state.current < health.state.maximum;
        if (!isEnrage) return;
        
        decor.add({
            offset: this.state.offset,
            type: OperatorType.ADD,
            reason: this,
        })
    }
}