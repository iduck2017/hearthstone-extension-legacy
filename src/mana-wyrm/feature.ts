import { FeatureModel, MinionCardModel, SpellCardModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";
import { ManaWyrmBuffModel } from "./buff";

@TemplUtil.is('mana-wyrm-feature')
export class ManaWyrmFeatureModel extends FeatureModel {
    public get route() {
        const result = super.route;
        const minion: MinionCardModel | undefined = result.list.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            minion
        };
    }

    constructor(props?: ManaWyrmFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                isBoard: true,
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
        if (!this.route.board) return;
        const minion = this.route.minion;
        if (!minion) return;
        const player = this.route.player;
        if (!player) return;
        
        // Only trigger when the minion's owner casts a spell
        if (that.route.player !== player) return;
        
        const role = minion.child.role;
        role.child.feats.add(new ManaWyrmBuffModel())
    }
}
