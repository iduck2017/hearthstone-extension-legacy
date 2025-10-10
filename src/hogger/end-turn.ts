import { EndTurnHookModel } from "hearthstone-core";
import { Loader, TemplUtil } from "set-piece";
import { GnollModel } from "../gnoll";

@TemplUtil.is('hogger-end-turn')
export class HoggerEndTurnModel extends EndTurnHookModel {
    constructor(loader?: Loader<HoggerEndTurnModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Hogger's End Turn",
                    desc: "At the end of your turn, summon a 2/2 Gnoll with Taunt.",
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {}
            };
        });
    }

    public async doRun(isCurrent: boolean) {
        if (!isCurrent) return;
        if (!this.route.board) return;

        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        
        // Summon a 2/2 Gnoll with Taunt
        const gnoll = new GnollModel();
        const deploy = gnoll.child.deploy;
        deploy.run(board);
    }
}
