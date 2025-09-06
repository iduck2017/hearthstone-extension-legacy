import { BattlecryModel } from "hearthstone-core";
import { StoreUtil, Loader } from "set-piece";

@StoreUtil.is('azure-drake-battlecry')
export class AzureDrakeBattlecryModel extends BattlecryModel<[]> {
    constructor(loader?: Loader<AzureDrakeBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Azure Drake Battlecry',
                    desc: 'Draw a card.',
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer }
            }
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