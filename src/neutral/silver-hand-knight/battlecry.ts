import { BattlecryModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { SquireModel } from "../squire";

@TemplUtil.is('silver-hand-knight-battlecry')
export class SilverHandKnightBattlecryModel extends BattlecryModel<never> {
    constructor(props?: SilverHandKnightBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Silver Hand Knight's Battlecry",
                desc: "Summon a 2/2 Squire.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): never | undefined {
        return undefined;
    }

    public async doRun(params: Array<never | undefined>) {
        // Summon a 2/2 Squire
        const minion = this.route.minion;
        if (!minion) return;
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        
        // Create a new Squire
        const target = new SquireModel();
        target.summon(board);
    }
}
