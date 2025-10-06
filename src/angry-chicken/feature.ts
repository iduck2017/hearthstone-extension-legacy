import { RoleAttackModel, RoleAttackProps, FeatureModel, RoleModel, RoleRoute, RoleHealthModel, RoleAttackDecor, ROLE_ROUTE, OperationType } from "hearthstone-core";
import { Event, EventUtil, StateUtil, StoreUtil, TranxUtil, Loader, Decor, Frame } from "set-piece";
import { DeepReadonly } from "utility-types";

export namespace AngryChickenFeatureProps {
    export type E = {};
    export type S = {
        offset: number,
    };
    export type C = {};
    export type R = {}
    export type P = RoleRoute
}

@StoreUtil.is('angry-chicken-feature')
export class AngryChickenFeatureModel extends FeatureModel<
    AngryChickenFeatureProps.E,
    AngryChickenFeatureProps.S,
    AngryChickenFeatureProps.C,
    AngryChickenFeatureProps.R,
    AngryChickenFeatureProps.P
> {
    constructor(loader?: Loader<AngryChickenFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
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
                route: ROLE_ROUTE,
            }
        });
    }
 // Listen to health state changes to trigger enrage effect
 @EventUtil.on(self => self.route.role?.proxy.child.health.event.onChange)
 @TranxUtil.span()
 private onHealthChange(that: RoleHealthModel, event: Event<Frame<RoleHealthModel>>) {
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