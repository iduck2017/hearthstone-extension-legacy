import { TurnEndModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('ragnaros-end-turn')
export class RagnarosEndTurnModel extends TurnEndModel {
    constructor(props?: RagnarosEndTurnModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Ragnaros\'s End Turn',
                desc: 'At the end of your turn, deal 8 damage to a random enemy.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public doRun(isCurrent: boolean) {
        if (!isCurrent) return; // Only trigger at the end of the current player's turn

        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const card = this.route.card;
        if (!card) return;

        // Get all enemy characters (hero and minions)
        const enemies = opponent.query();
        if (!enemies.length) return; // No enemies to damage

        // Choose a random enemy
        const index = Math.floor(Math.random() * enemies.length);
        const target = enemies[index];
        if (!target) return;

        // Deal 8 damage to the random enemy
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: 8,
            })
        ]);
    }
}
