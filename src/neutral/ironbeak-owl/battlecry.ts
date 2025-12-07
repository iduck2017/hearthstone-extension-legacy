import { BattlecryModel, Selector, MinionCardModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('ironbeak-owl-battlecry')
export class IronbeakOwlBattlecryModel extends BattlecryModel<MinionCardModel> {
    constructor(props?: IronbeakOwlBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Ironbeak Owl's Battlecry",
                desc: "Silence a minion.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<MinionCardModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.minions; // Can only target minions
        return new Selector(roles, { hint: "Choose a minion to silence" });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
        const target = params[0];
        if (!target) return;
        // Silence the target minion
        target.silence();
    }
}
