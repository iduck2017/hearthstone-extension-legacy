import { BattlecryModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('novice-engineer-battlecry')
export class NoviceEngineerBattlecryModel extends BattlecryModel<never> {
    constructor(props?: NoviceEngineerBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Novice Engineer's Battlecry",
                desc: "Draw a card.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): never | undefined {
        // No target selection needed
        return undefined;
    }

    public async doRun(params: Array<never | undefined>) {
        const minion = this.route.minion;
        if (!minion) return;

        const player = this.route.player;
        if (!player) return;

        // Draw a card
        player.child.deck.draw();
    }
}
