// Young Priestess Feature - At the end of your turn, give another random friendly minion +1 Health

import { EndTurnHookModel, FeatureModel, RoleModel } from "hearthstone-core";
import { EventUtil } from "set-piece";
import { YoungPriestessBuffModel } from "./buff";

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
        const board = this.route.board;
        if (!board) return;
        const player = this.route.player;
        if (!player) return;
        const card = this.route.card;
        if (!card) return;
        const role = card.child.role;
       
        console.log('end turn')

        // Get all friendly minions except this one
        const roles = player.refer.minions.filter(item => item !== role);
        if (roles.length === 0) return;
        
        // Select random minion
        const index = Math.floor(Math.random() * roles.length);
        const target = roles[index];

        // Add health buff to target
        if (!target) return;
        target.child.features.add(new YoungPriestessBuffModel({}));
    }
} 