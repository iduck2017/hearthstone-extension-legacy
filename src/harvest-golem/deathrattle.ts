import { DeathrattleModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { DamagedGolemModel } from "../damaged-golem";

@TemplUtil.is('harvest-golem-deathrattle')
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

    protected doRun() {
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        
        // Create a new Damaged Golem
        const target = new DamagedGolemModel();
        target.deploy(board);
    }
}
