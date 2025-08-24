import { FeatureModel, MinionModel, RoleModel, DamageType, DamageUtil, DamageEvent, GameModel } from "hearthstone-core";
import { EventUtil } from "set-piece";
import { StoreUtil } from "set-piece";

@StoreUtil.is('knife-juggler-feature')
export class KnifeJugglerFeatureModel extends FeatureModel {
    constructor(props: KnifeJugglerFeatureModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Knife Juggler\'s Feature',
                desc: 'After you summon a minion, deal 1 damage to a random enemy.',
                status: 1,
            },
            child: {},
            refer: {}
        });
    }

    @EventUtil.on(self => {
        const proxy = self.route.player?.proxy;
        if (!proxy) return;
        const card = proxy.child.board.child.cards;
        return card.child.minion?.event.onSummon;
    })
    private onSummon(that: MinionModel, event: {}) {
        const role = this.route.role;
        if (!role) return;
        if (!this.route.board) return;
        if (that === role) return;
        
        // Get the game instance
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;

        const roles = opponent.refer.roles;
        if (roles.length === 0) return;
        
        // Select random enemy
        const index = Math.floor(Math.random() * roles.length);
        const target = roles[index];
        if (!target) return;
        
        // Deal 1 damage to random enemy
        DamageUtil.run([
            new DamageEvent({
                source: this.child.anchor,
                target,
                origin: 1,
                type: DamageType.DEFAULT,
            })
        ]);
    }
} 