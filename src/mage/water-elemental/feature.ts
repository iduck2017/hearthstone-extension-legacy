import { DamageEvent, DamageModel, FrozenModel, RoleFeatureModel } from "hearthstone-core";
import { Event, EventPlugin, ChunkService } from "set-piece";

@ChunkService.is('water-elemental-feature')
export class WaterElementalFeatureModel extends RoleFeatureModel {
    constructor(props?: WaterElementalFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Water Elemental's feature",
                desc: "Freeze any character damaged by this minion.",
                isEnabled: true,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }


    @EventPlugin.on(self => self.handleDamage)
    private listenDamage() {
        return this.route.card?.proxy.child.damage.event?.onDeal
    }
    private handleDamage(that: DamageModel, event: DamageEvent) {
        const target = event.detail.target;
        FrozenModel.enable([target]);
    }
}
