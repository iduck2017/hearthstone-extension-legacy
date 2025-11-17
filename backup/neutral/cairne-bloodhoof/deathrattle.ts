import { DeathrattleModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { BaineBloodhoofModel } from "../baine-bloodhoof";

@TemplUtil.is('cairne-bloodhoof-deathrattle')
export class CairneBloodhoofDeathrattleModel extends DeathrattleModel {
    constructor(props?: CairneBloodhoofDeathrattleModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Cairne Bloodhoof's Deathrattle",
                desc: "Summon a 5/5 Baine Bloodhoof.",
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
        
        // Summon Baine Bloodhoof
        const target = new BaineBloodhoofModel();
        target.deploy(board);
    }
}
