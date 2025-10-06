import { DeathrattleModel, ROLE_ROUTE } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";
import { DamagedGolemModel } from "../damaged-golem";

@StoreUtil.is('harvest-golem-deathrattle')
export class HarvestGolemDeathrattleModel extends DeathrattleModel {
    constructor(loader?: Loader<HarvestGolemDeathrattleModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Harvest Golem's Deathrattle",
                    desc: "Summon a 2/1 Damaged Golem.",
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: ROLE_ROUTE,
            }
        });
    }

    protected doRun() {
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        
        // Create a new Damaged Golem
        const card = new DamagedGolemModel();
        card.child.deploy.run(board, 0);
    }
}
