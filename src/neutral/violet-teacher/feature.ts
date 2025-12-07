import { RoleFeatureModel, SpellCardModel, SpellPerformModel } from "hearthstone-core";
import { Event, EventPlugin, ChunkService } from "set-piece";
import { VioletApprenticeModel } from "../violet-apprentice";

@ChunkService.is('violet-teacher-feature')
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

    protected get isActived() {
        const result = super.isActived;
        if (result) {
            console.log('pass');
        } 
        return result;
    }

    @EventPlugin.on(self => self.handleCast)
    private listenCast() {
        const spell = this.route.game?.proxy.any(SpellCardModel);
        if (!spell) return;
        return spell.child.perform.event?.onPlay
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
