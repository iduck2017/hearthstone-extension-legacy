import { DeathrattleModel } from "hearthstone-core";
import { ChunkService } from "set-piece";
import { DamagedGolemModel } from "../damaged-golem";

@ChunkService.is('harvest-golem-deathrattle')
export class HarvestGolemDeathrattleModel extends DeathrattleModel {
    constructor(props?: HarvestGolemDeathrattleModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Harvest Golem's Deathrattle",
                desc: "Summon a 2/1 Damaged Golem.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public doRun() {
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        const minion = new DamagedGolemModel();
        minion.summon(board, -1);
    }
}
