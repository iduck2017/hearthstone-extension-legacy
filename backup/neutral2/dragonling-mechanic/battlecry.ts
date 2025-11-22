import { BattlecryModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { MechanicalDragonlingModel } from "../mechanical-dragonling";

@TemplUtil.is('dragonling-mechanic-battlecry')
export class DragonlingMechanicBattlecryModel extends BattlecryModel<never> {
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

    public prepare(): never | undefined {
        // No target selection needed
        return undefined;
    }

    public run(params: never[]) {
        const minion = this.route.minion;
        if (!minion) return;

        const player = this.route.player;
        if (!player) return;

        const board = player.child.board;
        
        // Summon a Mechanical Dragonling
        const target = new MechanicalDragonlingModel();
        target.summon(board);
    }
}
