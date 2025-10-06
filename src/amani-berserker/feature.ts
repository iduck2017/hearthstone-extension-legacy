import { RoleAttackModel, RoleAttackProps, FeatureModel, RoleHealthModel, RoleModel, RoleRoute, ROLE_ROUTE, RoleAttackDecor, OperationType } from "hearthstone-core";
import { Event, EventUtil, StateUtil, StoreUtil, TranxUtil, Loader, Decor, Frame } from "set-piece";

export namespace AmaniBerserkerFeatureProps {
    export type E = {};
    export type S = {
        offset: number,
    };
    export type C = {};
    export type R = {}
    export type P = RoleRoute
}

@StoreUtil.is('amani-berserker-feature')
export class AmaniBerserkerFeatureModel extends FeatureModel<
    AmaniBerserkerFeatureProps.E,
    AmaniBerserkerFeatureProps.S,
    AmaniBerserkerFeatureProps.C,
    AmaniBerserkerFeatureProps.R,
    AmaniBerserkerFeatureProps.P
> {
    constructor(loader?: Loader<AmaniBerserkerFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Amani Berserker\'s Buff',
                    desc: 'Has +3 Attack while damaged.',
                    offset: 3,
                    isActive: true,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: ROLE_ROUTE,
            }
        });
    }

    // Listen to health state changes to trigger enrage effect
    @EventUtil.on(self => self.route.role?.proxy.child.health.event.onChange)
    @TranxUtil.span()
    private onHealthChange(that: RoleHealthModel, event: Event<Frame<RoleHealthModel>>) {
        if (that.state.current !== event.detail.state.current) this.reload()
        if (that.state.maxium !== event.detail.state.maxium) this.reload()
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
        const isEnrage = health.state.current < health.state.maxium;
        if (!isEnrage) return;
        
        decor.add({
            value: this.state.offset,
            type: OperationType.ADD,
            reason: this,
        })
    }
} 