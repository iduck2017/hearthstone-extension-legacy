import { TurnEndModel, RestoreModel, RestoreEvent } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('lightwell-end-turn')
export class LightwellEndTurnModel extends TurnEndModel {
    constructor(props?: LightwellEndTurnModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Lightwell\'s End Turn',
                desc: 'At the start of your turn, restore 3 Health to a damaged friendly character.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    protected run(isCurrent: boolean) {
        if (!isCurrent) return;

        const player = this.route.player;
        if (!player) return;
        
        // Find damaged friendly characters (hero and minions)
        const roles = player.refer.roles
            .filter(role => {
                const health = role.child.health;
                if (health.state.maximum > health.state.current) return true;
                return false;
            })
        
        if (!roles.length) return;

        // Choose a random damaged character
        const index = Math.floor(Math.random() * roles.length);
        const target = roles[index];
        if (!target) return;
        
        // Restore 3 Health
        const source = this.route.card;
        if (!source) return;
        
        RestoreModel.deal([
            new RestoreEvent({
                source: source,
                method: this,
                target: target,
                origin: 3,
            })
        ]);
    }
}