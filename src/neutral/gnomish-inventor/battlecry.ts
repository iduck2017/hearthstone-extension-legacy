import { MinionBattlecryModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('gnomish-inventor-battlecry')
export class GnomishInventorBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(props?: GnomishInventorBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Gnomish Inventor's Battlecry",
                desc: "Draw a card.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toRun(): [] | undefined {
        // No target selection needed
        return [];
    }

    public doRun(from: number, to: number) {
        const minion = this.route.minion;
        if (!minion) return;
        const player = minion.route.player;
        if (!player) return;

        // Draw a card
        player.child.deck.draw();
    }
}
