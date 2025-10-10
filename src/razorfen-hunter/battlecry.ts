import { MinionBattlecryModel, DeployModel } from "hearthstone-core";
import { Loader, TemplUtil } from "set-piece";
import { BoarModel } from "../boar";

@TemplUtil.is('razorfen-hunter-battlecry')
export class RazorfenHunterBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(loader?: Loader<RazorfenHunterBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Razorfen Hunter's Battlecry",
                    desc: "Summon a 1/1 Boar.",
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
        
        // Summon a Boar
        const target = new BoarModel();
        target.child.deploy.run(board, to);
    }
}
