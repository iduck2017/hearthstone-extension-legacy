import { CardModel, MinionCardModel, MinionPerformModel, SecretFeatureModel } from "hearthstone-core";
import { Event, EventPlugin, ChunkService, TranxService } from "set-piece";
import { PolymorphModel } from "../polymorph";

@ChunkService.is('mirror-entity-feature')
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

    @EventPlugin.on(self => self.handlePlay)
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
