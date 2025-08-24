import { BattlecryModel } from "hearthstone-core";
import { StoreUtil } from "set-piece";

@StoreUtil.is('gnomish-inventor-battlecry')
export class GnomishInventorBattlecryModel extends BattlecryModel<[]> {
    constructor(props: GnomishInventorBattlecryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Gnomish Inventor Battlecry',
                desc: 'Draw a card.',
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        });
    }

    // No target selection needed for this battlecry
    public toRun(): [] { return []; }

    // Draw a card when this minion is summoned
    public async doRun() {
        const player = this.route.player;
        if (!player) return;
        const deck = player.child.deck;
        deck.draw();
    }
} 