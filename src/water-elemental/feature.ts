import { DamageEvent, DamageModel, FeatureModel, MinionCardModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('water-elemental-feature')
export class WaterElementalFeatureModel extends FeatureModel {
    public get route() {
        const result = super.route;
        const minion: MinionCardModel | undefined = result.list.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            minion
        };
    }

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


    @EventUtil.on(self => self.handle)
    private listen() {
        return this.route.minion?.proxy.child.damage.event?.onRun
    }

    private handle(that: DamageModel, event: DamageEvent) {
        const minion = this.route.minion;
        if (!minion) return;
        const target = event.detail.target;
        const feats = target.child.feats;
        const frozen = feats.child.frozen;
        frozen.active();
    }
}
