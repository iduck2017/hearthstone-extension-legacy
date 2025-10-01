import { CardFeatureModel, MinionCardModel, SecretFeatureModel } from "hearthstone-core";
import { Event, EventUtil, Loader, StoreUtil } from "set-piece";

@StoreUtil.is('mirror-entity-feature')
export class MirrorEntityFeatureModel extends SecretFeatureModel {
    constructor(loader?: Loader<MirrorEntityFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: {
                    name: "Mirror Entity's feature",
                    desc: "Secret: After your opponent plays a minion, summon a copy of it.",
                    isActive: true,
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            }
        })
    }

    @EventUtil.on(self => self.route.game?.proxy.all(MinionCardModel).event.onPlay)
    @SecretFeatureModel.span()
    private onPlay(that: MinionCardModel, event: Event): boolean {
        const playerA = this.route.player;
        if (!playerA) return false;
        
        // Only trigger when opponent plays a minion
        const playerB = that.route.player;
        if (playerB === playerA) return false;
        
        // Create a copy of the minion
        const copy = StoreUtil.copy(that);
        if (!copy) return false;
        const deploy = copy.child.deploy;
        const board = playerA.child.board;
        deploy.run(board);
        return true;
    }
}
