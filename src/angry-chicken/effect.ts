import { FeatureModel, EffectModel, MinionRoleModel, RoleModel } from "hearthstone-core";
import { Event, EventUtil, StateUtil, TranxUtil } from "set-piece";
import { DeepReadonly } from "utility-types";

export namespace AngryChickenEffectModel {
    export type State = Partial<FeatureModel.State> & {
        readonly isEnable: false;
    }
    export type Event = {}
}

export class AngryChickenEffectModel extends EffectModel<
    MinionRoleModel,
    AngryChickenEffectModel.Event,
    AngryChickenEffectModel.State
> {
    constructor(props: AngryChickenEffectModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Angry Chicken\'s Buff',
                desc: 'Has +5 Attack while damaged.',
                modAttack: 5,
                modHealth: 0,
                isEnable: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.route.parent?.proxy.event.onStateChange)
    @TranxUtil.span()
    private handleHealthChange(that: MinionRoleModel, event: Event.OnStateChange<RoleModel>) {
        const { next } = event;
        const isActive = next.curHealth < next.maxHealth;
        if (isActive === this.state.isActive) return;
        this.draft.state.isActive = isActive;
        this.reload();
    }

    @StateUtil.use(self => self.route.parent?.proxy.decor)
    private decorateRoleAttack(
        that: MinionRoleModel, 
        state: DeepReadonly<MinionRoleModel.State & RoleModel.State>
    ): DeepReadonly<MinionRoleModel.State & RoleModel.State> {
        if (!this.state.isActive) return state;
        return {
            ...state,
            modAttack: state.modAttack + this.state.modAttack,
        }
    }

}