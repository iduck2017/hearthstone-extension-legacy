import { AttackModel, AttackProps, BuffModel, FeatureModel, HealthModel, HealthProps, RoleModel } from "hearthstone-core";
import { Event, EventUtil, StateUtil, StoreUtil, TranxUtil, Loader, StateChangeEvent, Decor } from "set-piece";

export namespace AmaniBerserkerFeatureModel {
    export type Event = {};
    export type State = {
        offsetAttack: number,
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
    constructor(loader?: Loader<AmaniBerserkerFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Amani Berserker\'s Buff',
                    desc: 'Has +3 Attack while damaged.',
                    offsetAttack: 3,
                    isActive: true,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    // Listen to health state changes to trigger enrage effect
    @EventUtil.on(self => self.route.role?.proxy.child.health.event.onStateChange)
    @TranxUtil.span()
    private onHealthChange(that: HealthModel, event: StateChangeEvent<HealthModel>) {
        this.reload();
    }

    // Apply attack buff when damaged
    @StateUtil.on(self => self.route.role?.proxy.child.attack.decor)
    private onCheck(
        that: AttackModel, 
        decor: Decor<AttackProps.S>
    ) {
        const role = that.route.role;
        if (!role) return
        ;
        const health = role.child.health;
        const isEnrage = health.state.current < health.state.limit;
        if (!isEnrage) return;
        
        decor.current.offset += this.state.offsetAttack;
    }
} 