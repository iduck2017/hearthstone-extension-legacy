import { DeathrattleModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('loot-hoarder-deathrattle')
export class LootHoarderDeathrattleModel extends DeathrattleModel {
    constructor(props?: LootHoarderDeathrattleModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Loot Hoarder's Deathrattle",
                desc: "Draw a card.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public run() {
        const player = this.route.player;
        if (!player) return;
        // Draw a card
        player.child.deck.draw();
    }
}
