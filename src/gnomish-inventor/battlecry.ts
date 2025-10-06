import { MinionBattlecryModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('gnomish-inventor-battlecry')
export class GnomishInventorBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(loader?: Loader<GnomishInventorBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Gnomish Inventor's Battlecry",
                    desc: "Draw a card.",
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }

    public toRun(): [] | undefined {
        // No target selection needed
        return [];
    }

    public async doRun(from: number, to: number) {
        const minion = this.route.minion;
        if (!minion) return;
        const player = minion.route.player;
        if (!player) return;

        // Draw a card
        player.child.deck.draw();
    }
}
