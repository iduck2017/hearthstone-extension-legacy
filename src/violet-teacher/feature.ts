import { CardFeatureModel, FeatureModel, MinionCardModel, SpellCardModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";
import { VioletApprenticeModel } from "../violet-apprentice";

@TemplUtil.is('violet-teacher-feature')
export class VioletTeacherFeatureModel extends CardFeatureModel {
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
        const card = this.route.card;
        if (!card) return;
        
        const player = this.route.player;
        if (!player) return;
        
        // Only trigger when the minion's owner casts a spell
        if (that.route.player !== player) return;
        const board = player.child.board;
        
        // Summon a Violet Apprentice
        const index = board.refer.queue.indexOf(card);
        const target = new VioletApprenticeModel();
        target.child.deploy.run(board, index === -1 ? -1 : index + 1);
    }
}
