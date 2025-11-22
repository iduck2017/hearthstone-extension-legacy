import { CardModel, MinionCardModel, SecretFeatureModel } from "hearthstone-core";
import { MinionPerformModel } from "hearthstone-core/dist/type/models/features/perform/minion";
import { Event, EventUtil, TemplUtil, TranxUtil } from "set-piece";
import { PolymorphModel } from "../polymorph";

@TemplUtil.is('mirror-entity-feature')
export class MirrorEntityFeatureModel extends SecretFeatureModel {
    constructor(props?: MirrorEntityFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Mirror Entity's feature",
                desc: "Secret: After your opponent plays a minion, summon a copy of it.",
                actived: true,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handlePlay)
    private listenPlay() {
        return this.route.game?.proxy.any(MinionCardModel).child.perform.event?.onPlay
    }
    @SecretFeatureModel.span()
    private handlePlay(that: MinionPerformModel, event: Event) {
        const playerA = this.route.player;
        if (!playerA) return;
        
        // Get the minion card from the perform model
        const minion = that.route.card;
        if (!minion || !(minion instanceof MinionCardModel)) return;
        
        // Only trigger when opponent plays a minion
        const playerB = minion.route.player;
        if (playerB === playerA) return;
        
        // Create a copy of the minion
        const copy = minion.clone<MinionCardModel>();
        if (!copy) return;
        copy.summon(playerA.child.board);

        return true;
    }

}
