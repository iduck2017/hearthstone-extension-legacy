import { SpellCardModel, RoleBuffModel, RoleFeatureModel } from "hearthstone-core";
import { SpellPerformModel } from "hearthstone-core/dist/type/models/features/perform/spell";
import { Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('mana-wyrm-feature')
export class ManaWyrmFeatureModel extends RoleFeatureModel {

    constructor(props?: ManaWyrmFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Mana Wyrm's feature",
                desc: "Whenever you cast a spell, gain +1 Attack.",
                actived: true,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleCast)
    private listenCast() {
        return this.route.player?.proxy.any(SpellCardModel).child.perform.event?.onPlay
    }
    private handleCast(that: SpellPerformModel, event: Event) {
        const role = this.route.role;
        if (!role) return;
        const player = this.route.player;
        if (!player) return;
        
        // Only trigger when the minion's owner casts a spell
        if (that.route.player !== player) return;
        
        role.buff(new RoleBuffModel({
            state: {
                name: "Mana Wyrm's Buff",
                desc: "+1 Attack.",
                offset: [1, 0]
            }
        }))
    }
}
