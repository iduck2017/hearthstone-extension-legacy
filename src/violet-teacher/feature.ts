import { FeatureModel, MinionCardModel, SpellCardModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";
import { VioletApprenticeModel } from "../violet-apprentice";

export namespace VioletTeacherFeatureProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@TemplUtil.is('violet-teacher-feature')
export class VioletTeacherFeatureModel extends FeatureModel<
    VioletTeacherFeatureProps.E,
    VioletTeacherFeatureProps.S,
    VioletTeacherFeatureProps.C,
    VioletTeacherFeatureProps.R
> {
    public get route() {
        const result = super.route;
        const minion: MinionCardModel | undefined = result.list.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            minion
        };
    }

    constructor(props?: VioletTeacherFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Violet Teacher's feature",
                desc: "Whenever you cast a spell, summon a 1/1 Violet Apprentice.",
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
        const board = player.child.board;
        
        // Summon a Violet Apprentice
        const index = board.refer.queue?.indexOf(minion);
        const target = new VioletApprenticeModel();
        target.child.deploy.run(board, index === -1 ? -1 : index + 1);
    }
}
