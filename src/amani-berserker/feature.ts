import { AttackModel, BuffModel, FeatureModel, HealthModel, RoleModel } from "hearthstone-core";
import { Event, EventUtil, StateUtil, StoreUtil, TranxUtil } from "set-piece";
import { DeepReadonly } from "utility-types";

export namespace AmaniBerserkerFeatureModel {
    export type Event = {};
    export type State = {
        attack: number,
    };
    export type Child = {};
    export type Refer = {}
}

@StoreUtil.is('amani-berserker-feature')
export class AmaniBerserkerFeatureModel extends FeatureModel<
    AmaniBerserkerFeatureModel.Event,
    AmaniBerserkerFeatureModel.State,
    AmaniBerserkerFeatureModel.Child,
    AmaniBerserkerFeatureModel.Refer
> {
    constructor(props: AmaniBerserkerFeatureModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Amani Berserker\'s Buff',
                desc: 'Has +3 Attack while damaged.',
                attack: 3,
                status: 1,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    // Listen to health state changes to trigger enrage effect
    @EventUtil.on(self => self.route.role?.proxy.child.health.event.onStateChange)
    @TranxUtil.span()
    private onHealthChange(that: HealthModel, event: Event.OnStateChange<HealthModel>) {
        this.reload();
    }

    // Apply attack buff when damaged
    @StateUtil.on(self => self.route.role?.proxy.child.attack.decor)
    private onCheck(
        that: AttackModel, 
        state: DeepReadonly<AttackModel.State>
    ): DeepReadonly<AttackModel.State> {
        const role = that.route.role;
        if (!role) return state;
        const health = role.child.health;
        const isEnrage = health.state.current < health.state.limit;
        if (!isEnrage) return state;
        if (!this.state.status) return state;
        const result = { ...state };
        result.offset = state.offset + this.state.attack;
        return result;
    }
} 