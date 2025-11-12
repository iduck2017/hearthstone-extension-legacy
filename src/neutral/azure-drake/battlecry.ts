import { MinionBattlecryModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('azure-drake-battlecry')
export class AzureDrakeBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(props?: AzureDrakeBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Azure Drake Battlecry',
                desc: 'Draw a card.',
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    // No target selection needed for this battlecry
    public toRun(): [] { return []; }

    // Draw a card when this minion is summoned
    public doRun() {
        const player = this.route.player;
        if (!player) return;
        const deck = player.child.deck;
        deck.draw();
    }
} 