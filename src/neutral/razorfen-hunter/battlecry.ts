import { BattlecryModel } from "hearthstone-core";
import { ChunkService } from "set-piece";
import { BoarModel } from "../boar";

@ChunkService.is('razorfen-hunter-battlecry')
export class RazorfenHunterBattlecryModel extends BattlecryModel<never> {
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

    public precheck(): never | undefined {
        // No target selection needed
        return undefined;
    }

    public async doRun(params: Array<never | undefined>) {
        const minion = this.route.minion;
        if (!minion) return;

        const player = this.route.player;
        if (!player) return;

        const board = player.child.board;
        
        // Summon a Boar
        const target = new BoarModel();
        target.summon(board);
    }
}
