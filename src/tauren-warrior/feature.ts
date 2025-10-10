import { FeatureModel, RoleAttackModel, RoleAttackDecor, OperationType } from "hearthstone-core";
import { EventUtil, TemplUtil, StateUtil, TranxUtil } from "set-piece";

export namespace TaurenWarriorFeatureProps {
    export type E = {}
    export type S = {
        offset: number,
    }
    export type C = {}
    export type R = {}
}

@TemplUtil.is('tauren-warrior-feature')
export class TaurenWarriorFeatureModel extends FeatureModel<
    TaurenWarriorFeatureProps.E,
    TaurenWarriorFeatureProps.S,
    TaurenWarriorFeatureProps.C,
    TaurenWarriorFeatureProps.R
> {
    constructor(props?: TaurenWarriorFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Tauren Warrior's Buff",
                desc: "Has +3 Attack while damaged.",
                offset: 3,
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    // Listen to health state changes to trigger enrage effect
    @EventUtil.on(self => self.route.role?.proxy.child.health.event.onChange)
    @TranxUtil.span()
    private onHealthChange(that: any, event: any) {
        if (that.state.current !== event.detail.state.current) this.reload()
        if (that.state.maximum !== event.detail.state.maximum) this.reload()
    }

    // Apply attack buff when damaged
    @StateUtil.on(self => self.route.role?.proxy.child.attack.decor)
    private onCheck(
        that: RoleAttackModel,
        decor: RoleAttackDecor
    ) {
        const role = that.route.role;
        if (!role) return;

        const health = role.child.health;
        const isEnrage = health.state.current < health.state.maximum;
        if (!isEnrage) return;
        
        decor.add({
            value: this.state.offset,
            type: OperationType.ADD,
            reason: this,
        })
    }
}
