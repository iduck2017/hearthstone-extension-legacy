import { CardFeatureModel, FeatureModel, MinionCardModel, MinionFeatureModel, SpellCardModel, RoleBuffModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('arcane-devourer-feature')
export class ArcaneDevourerFeatureModel extends MinionFeatureModel {

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
        
        minion.child.feats.add(new RoleBuffModel({
            state: {
                name: "Arcane Devourer's Buff",
                desc: "+2/+2.",
                offset: [2, 2]
            }
        }))
    }
}
