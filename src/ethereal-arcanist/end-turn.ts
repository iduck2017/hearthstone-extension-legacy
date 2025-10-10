import { EndTurnHookModel } from "hearthstone-core";
import { DebugUtil, TemplUtil } from "set-piece";
import { EtherealArcanistBuffModel } from "./buff";

export namespace EtherealArcanistFeatureProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@TemplUtil.is('ethereal-arcanist-end-turn')
export class EtherealArcanistFeatureModel extends EndTurnHookModel<
    EtherealArcanistFeatureProps.E,
    EtherealArcanistFeatureProps.S,
    EtherealArcanistFeatureProps.C,
    EtherealArcanistFeatureProps.R
> {
    constructor(props?: EtherealArcanistFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Ethereal Arcanist\'s Hook',
                desc: 'If you control a Secret at the end of your turn, gain +2/+2.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    protected doRun(isCurrent: boolean) {
        if (!isCurrent) return;
        if (!this.route.board) return;

        const player = this.route.player;
        if (!player) return;
        const minion = this.route.minion;
        if (!minion) return;

        // Check if player controls any secrets
        const board = player.child.board;
        const secrets = board.child.secrets;
        if (!secrets.length) return;

        const role = minion.child.role;
        role.child.feats.add(new EtherealArcanistBuffModel());
    }
}
