import { FeatureModel, MinionCardModel, SpellCardModel } from "hearthstone-core";
import { ArcaneDevourerBuffModel } from "./buff";
import { Event, EventUtil, TemplUtil } from "set-piece";

export namespace ArcaneDevourerFeatureProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@TemplUtil.is('arcane-devourer-feature')
export class ArcaneDevourerFeatureModel extends FeatureModel<
    ArcaneDevourerFeatureProps.E,
    ArcaneDevourerFeatureProps.S,
    ArcaneDevourerFeatureProps.C,
    ArcaneDevourerFeatureProps.R
> {
    public get route() {
        const result = super.route;
        const minion: MinionCardModel | undefined = result.list.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            minion
        };
    }

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
        if (!this.route.board) return;
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
