import { DamageEvent, DamageModel, FeatureModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

export namespace WaterElementalFeatureProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@TemplUtil.is('water-elemental-feature')
export class WaterElementalFeatureModel extends FeatureModel<
    WaterElementalFeatureProps.E,
    WaterElementalFeatureProps.S,
    WaterElementalFeatureProps.C,
    WaterElementalFeatureProps.R
> {
    constructor(props?: WaterElementalFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Water Elemental's feature",
                desc: "Freeze any character damaged by this minion.",
                isActive: true,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
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
