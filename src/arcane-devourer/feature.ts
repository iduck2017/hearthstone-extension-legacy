import { CardFeatureModel, FeatureModel, MinionCardModel, RoleFeatureModel, SpellCardModel } from "hearthstone-core";
import { ArcaneDevourerBuffModel } from "./buff";
import { Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('arcane-devourer-feature')
export class ArcaneDevourerFeatureModel extends RoleFeatureModel {

    constructor(props?: ArcaneDevourerFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Arcane Devourer's feature",
                desc: "Whenever you cast a spell, gain +2/+2.",
                isActive: true,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleCast)
    private listenCast() {
        return this.route.player?.proxy.any(SpellCardModel).event?.onPlay
    }
    private handleCast(that: SpellCardModel, event: Event) {
        const minion = this.route.minion;
        if (!minion) return;
        const player = this.route.player;
        if (!player) return;
        
        // Only trigger when the minion's owner casts a spell
        if (that.route.player !== player) return;
        
        const role = minion.child.role;
        role.child.feats.add(new ArcaneDevourerBuffModel())
    }
}
