import { RoleFeatureModel, SpellCardModel, SpellPerformModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";
import { VioletApprenticeModel } from "../violet-apprentice";

@TemplUtil.is('violet-teacher-feature')
export class VioletTeacherFeatureModel extends RoleFeatureModel {
    constructor(props?: VioletTeacherFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Violet Teacher's feature",
                desc: "Whenever you cast a spell, summon a 1/1 Violet Apprentice.",
                isEnabled: true,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleCast)
    private listenCast() {
        return this.route.game?.proxy.any(SpellCardModel).child.perform.event?.onPlay
    }
    private handleCast(that: SpellPerformModel, event: Event) {
        const minion = this.route.minion;
        if (!minion) return;

        const player = this.route.player;
        if (!player) return;
        
        // Only trigger when the minion's owner casts a spell
        if (that.route.player !== player) return;
        const board = player.child.board;
        
        // Summon a Violet Apprentice
        const index = board.child.cards.indexOf(minion);
        const target = new VioletApprenticeModel();
        target.summon(board);
    }
}
