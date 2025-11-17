import { MinionBattlecryModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { MechanicalDragonlingModel } from "../mechanical-dragonling";

@TemplUtil.is('dragonling-mechanic-battlecry')
export class DragonlingMechanicBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(props?: DragonlingMechanicBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Dragonling Mechanic's Battlecry",
                desc: "Summon a 2/1 Mechanical Dragonling.",
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
        
        // Summon a Mechanical Dragonling
        const target = new MechanicalDragonlingModel();
        target.deploy(board, to);
    }
}
