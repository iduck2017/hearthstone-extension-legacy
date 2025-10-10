import { DeathrattleModel, ROLE_ROUTE } from "hearthstone-core";
import { Loader, TemplUtil } from "set-piece";

@TemplUtil.is('loot-hoarder-deathrattle')
export class LootHoarderDeathrattleModel extends DeathrattleModel {
    constructor(loader?: Loader<LootHoarderDeathrattleModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Loot Hoarder's Deathrattle",
                    desc: "Draw a card.",
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: ROLE_ROUTE,
            }
        });
    }

    protected doRun() {
        const player = this.route.player;
        if (!player) return;
        // Draw a card
        player.child.deck.draw();
    }
}
