// Young Priestess Feature - At the end of your turn, give another random friendly minion +1 Health

import { EndTurnHookModel, FeatureModel, RoleModel } from "hearthstone-core";
import { EventUtil } from "set-piece";
import { YoungPriestessBuffModel } from "./buff";
import { StoreUtil } from "set-piece";

@StoreUtil.is('young-priestess-hook')
export class YoungPriestessHookModel extends EndTurnHookModel {
    constructor(props: YoungPriestessHookModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Young Priestess\'s Feature',
                desc: 'At the end of your turn, give another random friendly minion +1 Health.',
                status: 1,
            },
            child: {},
            refer: {}
        });
    }

    protected doRun() {
        const player = this.route.player;
        if (!player) return;
        const card = this.route.card;
        if (!card) return;
        const minion = card.child.minion;

        // Get all friendly minions except this one
        const minions = player.refer.minions.filter(item => item !== minion);
        if (minions.length === 0) return;
        
        // Select random minion
        const index = Math.floor(Math.random() * minions.length);
        const target = minions[index];

        // Add health buff to target
        if (!target) return;
        target.child.features.add(new YoungPriestessBuffModel({}));
    }
} 