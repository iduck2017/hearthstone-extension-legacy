import { TurnEndModel, DamageModel, DamageType, DamageEvent, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('ragnaros-end-turn')
export class RagnarosEndTurnModel extends TurnEndModel {
    public get route() {
        const result = super.route;
        const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            minion
        };
    }

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

    protected doRun() {
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const minion = this.route.minion;
        if (!minion) return;

        // Get all enemy characters (hero and minions)
        const enemies = opponent.refer.roles;
        if (!enemies.length) return; // No enemies to damage

        // Choose a random enemy
        const index = Math.floor(Math.random() * enemies.length);
        const target = enemies[index];
        if (!target) return;

        // Deal 8 damage to the random enemy
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: minion,
                method: this,
                target,
                origin: 8,
            })
        ]);
    }
}
