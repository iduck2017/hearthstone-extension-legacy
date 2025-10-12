import { CardModel, MinionCardModel, SecretFeatureModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('mirror-entity-feature')
export class MirrorEntityFeatureModel extends SecretFeatureModel {
    constructor(props?: MirrorEntityFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Mirror Entity's feature",
                desc: "Secret: After your opponent plays a minion, summon a copy of it.",
                isActive: true,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handlePlay)
    private listenPlay() {
        return this.route.game?.proxy.any(MinionCardModel).event?.onPlay
    }
    @SecretFeatureModel.span()
    private handlePlay(that: MinionCardModel, event: Event) {
        const playerA = this.route.player;
        if (!playerA) return;
        
        // Only trigger when opponent plays a minion
        const playerB = that.route.player;
        if (playerB === playerA) return;
        
        // Create a copy of the minion
        const copy = TemplUtil.copy(that);
        if (!copy) return;
        const board = playerA.child.board;
        copy.deploy(board);
        return true;
    }
}
