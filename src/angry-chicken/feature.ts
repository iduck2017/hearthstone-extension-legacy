import { AttackModel, BuffModel, FeatureModel, HealthModel, RoleModel } from "hearthstone-core";
import { Event, EventUtil, StateUtil, TranxUtil } from "set-piece";
import { DeepReadonly } from "utility-types";

export namespace AngryChickenFeatureModel {
    export type Event = {};
    export type State = {
        attack: number,
    };
    export type Child = {};
    export type Refer = {}
}

export class AngryChickenFeatureModel extends FeatureModel<
    AngryChickenFeatureModel.Event,
    AngryChickenFeatureModel.State,
    AngryChickenFeatureModel.Child,
    AngryChickenFeatureModel.Refer
> {
    constructor(props: AngryChickenFeatureModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Angry Chicken\'s Buff',
                desc: 'Has +5 Attack while damaged.',
                attack: 5,
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.route.role?.proxy.child.health.event.onStateChange)
    @TranxUtil.span()
    private onHealthChange(that: HealthModel, event: Event.OnStateChange<HealthModel>) {
        this.reload();
    }

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
        if (!this.state.isActive) return state;
        return {
            ...state,
            origin: state.origin + this.state.attack,
        }
    }

    @TranxUtil.span()
    protected doDisable(): void {
        this.reload();
    }
}