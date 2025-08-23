// Murloc Tidehunter Battlecry - Summon a 1/1 Murloc Scout

import { BattlecryModel } from "hearthstone-core";
import { MurlocScoutModel } from "../murloc-scout";

export class MurlocTidehunterBattlecryModel extends BattlecryModel<[]> {
    constructor(props: MurlocTidehunterBattlecryModel['props']) {
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

    public async doRun() {
        const player = this.route.player;
        if (!player) return;
        const card = this.route.card;
        const board = player.child.board;
        const minion = new MurlocScoutModel({});
        const roles = board.child.cards;
        const position = roles.findIndex(item => item === card);
        minion.summon(board, position + 1);
    }
}
