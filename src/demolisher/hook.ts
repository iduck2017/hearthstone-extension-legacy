import { StartTurnHookModel, RoleModel, DamageType, DamageUtil, DamageEvent } from "hearthstone-core";
import { StoreUtil } from "set-piece";

@StoreUtil.is('demolisher-hook')
export class DemolisherHookModel extends StartTurnHookModel {
    constructor(props: DemolisherHookModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Demolisher\'s Feature',
                desc: 'At the start of your turn, deal 2 damage to a random enemy.',
                status: 1,
            },
            child: {},
            refer: {}
        });
    }

    protected async doRun() {
        const player = this.route.player;
        if (!player) return;
        const card = this.route.card;
        if (!card) return;

        // Get the opponent
        const opponent = player.refer.opponent;
        if (!opponent) return;

        // Get all enemy roles (hero and minions)
        const roles = opponent.refer.roles;
        if (roles.length === 0) return;
        
        // Select random enemy
        const index = Math.floor(Math.random() * roles.length);
        const target = roles[index];
        if (!target) return;
        
        // Deal 2 damage to random enemy
        DamageUtil.run([
            new DamageEvent({
                source: this.child.anchor,
                target,
                origin: 2,
                type: DamageType.DEFAULT,
            })
        ]);
    }
} 