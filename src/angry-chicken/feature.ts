import { AttackModel, AttackProps, BuffModel, FeatureModel, HealthModel, RoleModel } from "hearthstone-core";
import { Event, EventUtil, StateUtil, StoreUtil, TranxUtil, Loader, StateChangeEvent, Decor } from "set-piece";
import { DeepReadonly } from "utility-types";

export namespace AngryChickenFeatureProps {
    export type E = {};
    export type S = {
        offsetAttack: number,
    };
    export type C = {};
    export type R = {}
}

@StoreUtil.is('angry-chicken-feature')
export class AngryChickenFeatureModel extends FeatureModel<
    AngryChickenFeatureProps.E,
    AngryChickenFeatureProps.S,
    AngryChickenFeatureProps.C,
    AngryChickenFeatureProps.R
> {
    constructor(loader?: Loader<AngryChickenFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Angry Chicken\'s Buff',
                    desc: 'Has +5 Attack while damaged.',
                    offsetAttack: 5,
                    isActive: true,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    @EventUtil.on(self => self.route.role?.proxy.child.health.event.onStateChange)
    @TranxUtil.span()
    private onHealthChange(that: HealthModel, event: StateChangeEvent<HealthModel>) {
        this.reload();
    }

    @StateUtil.on(self => self.route.role?.proxy.child.attack.decor)
    private onCheck(
        that: AttackModel, 
        decor: Decor<AttackProps.S>
    ) {
        const role = that.route.role;
        if (!role) return;
        const health = role.child.health;
        
        const isEnrage = health.state.current < health.state.limit;
        if (!isEnrage) return;
        
        decor.current.offset += this.state.offsetAttack;
    }
}