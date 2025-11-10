import { MinionFeatureModel, SpellCardModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";
import { ManaWyrmBuffModel } from "./buff";

@TemplUtil.is('mana-wyrm-feature')
export class ManaWyrmFeatureModel extends MinionFeatureModel {

    constructor(props?: ManaWyrmFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Mana Wyrm's feature",
                desc: "Whenever you cast a spell, gain +1 Attack.",
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
        const role = this.route.role;
        if (!role) return;
        const player = this.route.player;
        if (!player) return;
        
        // Only trigger when the minion's owner casts a spell
        if (that.route.player !== player) return;
        
        role.child.feats.add(new ManaWyrmBuffModel())
    }
}
