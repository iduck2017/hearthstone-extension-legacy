import { EndTurnHookModel } from "hearthstone-core";
import { DebugUtil, Loader, StoreUtil } from "set-piece";
import { EtherealArcanistBuffModel } from "./buff";

@StoreUtil.is('ethereal-arcanist-end-turn')
export class EtherealArcanistFeatureModel extends EndTurnHookModel {
    constructor(loader?: Loader<EtherealArcanistFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Ethereal Arcanist\'s Hook',
                    desc: 'If you control a Secret at the end of your turn, gain +2/+2.',
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    protected doRun(isCurrent: boolean) {
        if (!isCurrent) return;

        const player = this.route.player;
        if (!player) return;
        const minion = this.route.minion;
        if (!minion) return;

        // Check if player controls any secrets
        const board = player.child.board;
        const secrets = board.child.secrets;
        if (!secrets.length) return;

        const role = minion.child.role;
        DebugUtil.mute(false);
        role.add(new EtherealArcanistBuffModel());
        DebugUtil.mute(true);
    }
}
