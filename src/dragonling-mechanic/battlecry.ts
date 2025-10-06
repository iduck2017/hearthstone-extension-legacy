import { MinionBattlecryModel, DeployModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";
import { MechanicalDragonlingModel } from "../mechanical-dragonling";

@StoreUtil.is('dragonling-mechanic-battlecry')
export class DragonlingMechanicBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(loader?: Loader<DragonlingMechanicBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Dragonling Mechanic's Battlecry",
                    desc: "Summon a 2/1 Mechanical Dragonling.",
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }

    public toRun(): [] | undefined {
        // No target selection needed
        return [];
    }

    public async doRun(from: number, to: number) {
        const minion = this.route.minion;
        if (!minion) return;

        const player = minion.route.player;
        if (!player) return;

        const board = player.child.board;
        
        // Summon a Mechanical Dragonling
        const target = new MechanicalDragonlingModel();
        target.child.deploy.run(board, to);
    }
}
