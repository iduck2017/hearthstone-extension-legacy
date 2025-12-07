import { BattlecryModel } from "hearthstone-core";
import { ChunkService } from "set-piece";
import { MurlocScoutModel } from "../murloc-scout";

@ChunkService.is('murloc-tidehunter-battlecry')
export class MurlocTidehunterBattlecryModel extends BattlecryModel<never> {
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

    public precheck(): never | undefined {
        return undefined;
    }

    public async doRun(params: Array<never | undefined>) {
        const minion = this.route.minion;
        if (!minion) return;
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        const target = new MurlocScoutModel();
        
        // summon
        const index = board.child.cards.indexOf(minion)
        target.summon(board, index + 1);
    }
}
