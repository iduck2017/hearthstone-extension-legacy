import { TurnStartModel, RestoreModel, RestoreEvent, MinionCardModel, TurnEndModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('lightwell-end-turn')
export class LightwellTurnEndModel extends TurnEndModel {
    constructor(props?: LightwellTurnEndModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Lightwell\'s End Turn',
                desc: 'At the start of your turn, restore 3 Health to a damaged friendly character.',
                isEnabled: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    protected doRun(isCurrent: boolean) {
        if (!isCurrent) return;
        const player = this.route.player;
        if (!player) return;
        
        // Find damaged friendly characters (hero and minions)
        const roles = player.refer.roles
            .filter(role => {
                const health = role.child.health;
                return health.state.isInjured;
            })
        
        if (!roles.length) return;

        // Choose a random damaged character
        const index = Math.floor(Math.random() * roles.length);
        const target = roles[index];
        if (!target) return;
        
        // Restore 3 Health
        const card = this.route.card;
        if (!card) return;
        
        RestoreModel.deal([
            new RestoreEvent({
                source: card,
                method: this,
                target: target,
                origin: 3,
            })
        ]);
    }
}