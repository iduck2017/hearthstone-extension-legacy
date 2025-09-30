import { RoleBattlecryModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";
import { MurlocScoutModel } from "../murloc-scout";

@StoreUtil.is('murloc-tidehunter-battlecry')
export class MurlocTidehunterBattlecryModel extends RoleBattlecryModel<[]> {
    constructor(loader?: Loader<MurlocTidehunterBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Murloc Tidehunter\'s Battlecry',
                    desc: 'Summon a 1/1 Murloc Scout.',
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer }
            }
        });
    }

    public toRun(): [] { return []; }

    public async doRun(from: number, to: number) {
        const player = this.route.player;
        if (!player) return;
        console.log('batt', to)
        const board = player.child.board;
        const target = new MurlocScoutModel();
        // summon
        target.child.deploy.run(board, to);
    }
}
