import { MinionBattlecryModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { BoarModel } from "../boar";

@TemplUtil.is('razorfen-hunter-battlecry')
export class RazorfenHunterBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(props?: RazorfenHunterBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Razorfen Hunter's Battlecry",
                desc: "Summon a 1/1 Boar.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toRun(): [] | undefined {
        // No target selection needed
        return [];
    }

    public doRun(from: number, to: number) {
        const minion = this.route.minion;
        if (!minion) return;

        const player = minion.route.player;
        if (!player) return;

        const board = player.child.board;
        
        // Summon a Boar
        const target = new BoarModel();
        target.deploy(board, to);
    }
}
