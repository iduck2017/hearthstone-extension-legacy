import { RoleAttackModel, RoleAttackProps, BuffModel, FeatureModel, HealthModel, HealthProps, RoleModel } from "hearthstone-core";
import { Event, EventUtil, StateUtil, StoreUtil, TranxUtil, Loader, StateChangeEvent, Decor } from "set-piece";

export namespace AmaniBerserkerFeatureProps {
    export type E = {};
    export type S = {
        offsetAttack: number,
    };
    export type C = {};
    export type R = {}
}

@StoreUtil.is('amani-berserker-feature')
export class AmaniBerserkerFeatureModel extends FeatureModel<
    AmaniBerserkerFeatureProps.E,
    AmaniBerserkerFeatureProps.S,
    AmaniBerserkerFeatureProps.C,
    AmaniBerserkerFeatureProps.R
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
        that: RoleAttackModel, 
        decor: Decor<RoleAttackProps.S>
    ) {
        const role = that.route.role;
        if (!role) return;
        const health = role.child.health;
        
        const isEnrage = health.state.current < health.state.limit;
        if (!isEnrage) return;
        
        decor.current.offset += this.state.offsetAttack;
    }
} 