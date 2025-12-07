import { TurnEndModel } from "hearthstone-core";
import { ChunkService } from "set-piece";
import { GnollModel } from "../gnoll";

@ChunkService.is('hogger-end-turn')
export class HoggerEndTurnModel extends TurnEndModel {
    constructor(props?: HoggerEndTurnModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Hogger's End Turn",
                desc: "At the end of your turn, summon a 2/2 Gnoll with Taunt.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    protected doRun() {
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        
        // Summon a 2/2 Gnoll with Taunt
        const target = new GnollModel();
        target.summon(board);
    }
}
