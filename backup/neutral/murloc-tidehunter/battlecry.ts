import { MinionBattlecryModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { MurlocScoutModel } from "../murloc-scout";

@TemplUtil.is('murloc-tidehunter-battlecry')
export class MurlocTidehunterBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(props?: MurlocTidehunterBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Tidehunter\'s Battlecry',
                desc: 'Summon a 1/1 Murloc Scout.',
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        });
    }

    public toRun(): [] { return []; }

    public doRun(from: number, to: number) {
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        const target = new MurlocScoutModel();
        // summon
        target.deploy(board, to);
    }
}
