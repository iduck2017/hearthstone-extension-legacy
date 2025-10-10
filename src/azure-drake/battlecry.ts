import { MinionBattlecryModel } from "hearthstone-core";
import { TemplUtil, Loader } from "set-piece";

@TemplUtil.is('azure-drake-battlecry')
export class AzureDrakeBattlecryModel extends MinionBattlecryModel<[]> {
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