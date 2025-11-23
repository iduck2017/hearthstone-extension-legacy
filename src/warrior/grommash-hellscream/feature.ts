import { RoleAttackModel, RoleHealthModel, RoleAttackDecor, OperatorType, RoleFeatureModel } from "hearthstone-core";
import { Event, EventUtil, StateUtil, TemplUtil, TranxUtil, Frame } from "set-piece";

export namespace GrommashHellscreamFeatureModel {
    export type E = {};
    export type S = { offset: number };
    export type C = {};
    export type R = {}
}

@TemplUtil.is('grommash-hellscream-feature')
export class GrommashHellscreamFeatureModel extends RoleFeatureModel<
    GrommashHellscreamFeatureModel.E,
    GrommashHellscreamFeatureModel.S,
    GrommashHellscreamFeatureModel.C,
    GrommashHellscreamFeatureModel.R
> {
    constructor(props?: GrommashHellscreamFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Grommash Hellscream's Buff",
                desc: "Has +6 Attack while damaged.",
                offset: 6,
                isEnabled: true,
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
        const isEnrage = health.state.isInjured;
        if (!isEnrage) return;
        
        decor.add({
            offset: this.state.offset,
            type: OperatorType.ADD,
            reason: this,
        })
    }
}

