import { MinionBattlecryModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('novice-engineer-battlecry')
export class NoviceEngineerBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(loader?: Loader<NoviceEngineerBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Novice Engineer's Battlecry",
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
