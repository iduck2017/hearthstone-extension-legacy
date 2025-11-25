import { Selector, SpellEffectModel, DamageModel, DamageEvent, DamageType, RoleModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('consecration-effect')
export class ConsecrationEffectModel extends SpellEffectModel<never> {
    constructor(props?: ConsecrationEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Consecration's effect",
                desc: "Deal *2* damage to all enemies.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<never> | undefined {
        return undefined;
    }

    public async doRun() {
        const game = this.route.game;
        if (!game) return;
        const card = this.route.card;
        if (!card) return;
        const player = this.route.player;
        if (!player) return;

        // Get all enemy roles (hero and minions)
        const enemies: RoleModel[] = [];
        const enemyPlayer = game.child.playerA === player ? game.child.playerB : game.child.playerA;
        if (enemyPlayer) {
            // Add enemy hero
            enemies.push(enemyPlayer.child.hero);
            // Add enemy minions
            const enemyMinions = game.refer.minions.filter(minion => minion.route.player === enemyPlayer);
            enemies.push(...enemyMinions);
        }

        // Deal 2 damage to all enemies
        const damageEvents = enemies.map(enemy => 
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target: enemy,
                origin: 2,
            })
        );

        DamageModel.deal(damageEvents);
    }
}

