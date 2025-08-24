import { DeathrattleModel, RoleModel } from "hearthstone-core";
import { StoreUtil } from "set-piece";

@StoreUtil.is('loot-hoarder-deathrattle')
export class LootHoarderDeathrattleModel extends DeathrattleModel {
    constructor(props: LootHoarderDeathrattleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Loot Hoarder\'s Deathrattle',
                desc: 'Draw a card.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    // Draw a card when this minion dies
    public async doRun() {
        const player = this.route.player;
        if (!player) return;
        const deck = player.child.deck;
        deck.draw();
    }
} 