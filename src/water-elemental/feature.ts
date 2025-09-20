import { CardFeatureModel, DamageEvent, DamageModel } from "hearthstone-core";
import { Event, EventUtil, Loader, StoreUtil } from "set-piece";

@StoreUtil.is('water-elemental-feature')
export class WaterElementalFeatureModel extends CardFeatureModel {
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
                refer: { ...props.refer } 
            }
        })
    }

    @EventUtil.on(self => self.route.minion?.proxy.child.damage.event.onRun)
    private onDamageRun(that: DamageModel, event: DamageEvent) {
        const minion = this.route.minion;
        if (!minion) return;
        const target = event.detail.target;
        const entries = target.child.entries;
        const frozen = entries.child.frozen;
        frozen.active();
    }
}
