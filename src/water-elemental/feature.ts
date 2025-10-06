import { DamageEvent, DamageModel, FeatureModel, ROLE_ROUTE, RoleRoute } from "hearthstone-core";
import { Event, EventUtil, Loader, StoreUtil } from "set-piece";

export namespace WaterElementalFeatureProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = RoleRoute
}

@StoreUtil.is('water-elemental-feature')
export class WaterElementalFeatureModel extends FeatureModel<
    WaterElementalFeatureProps.E,
    WaterElementalFeatureProps.S,
    WaterElementalFeatureProps.C,
    WaterElementalFeatureProps.R,
    WaterElementalFeatureProps.P
> {
    constructor(loader?: Loader<WaterElementalFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Water Elemental's feature",
                    desc: "Freeze any character damaged by this minion.",
                    isActive: true,
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: ROLE_ROUTE,
            }
        })
    }

    @EventUtil.on(self => self.route.minion?.proxy.child.damage.event.onRun)
    private onDamageRun(that: DamageModel, event: DamageEvent) {
        const minion = this.route.minion;
        if (!minion) return;
        const target = event.detail.target;
        const feats = target.child.feats;
        const frozen = feats.child.frozen;
        frozen.active();
    }
}
