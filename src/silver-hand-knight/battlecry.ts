import { MinionBattlecryModel } from "hearthstone-core";
import { Loader, TemplUtil } from "set-piece";
import { SquireModel } from "../squire";

@TemplUtil.is('silver-hand-knight-battlecry')
export class SilverHandKnightBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(loader?: Loader<SilverHandKnightBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Silver Hand Knight's Battlecry",
                    desc: "Summon a 2/2 Squire.",
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }

    public toRun(): [] | undefined {
        return [];
    }

    public async doRun(from: number, to: number) {
        // Summon a 2/2 Squire
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        
        // Create a new Squire
        const card = new SquireModel();
        card.child.deploy.run(board, to);
    }
}
