import { Selector, RoleModel, DamageModel, DamageEvent, DamageType, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('swipe-effect')
export class SwipeEffectModel extends SpellEffectModel<[RoleModel]> {
    constructor(props?: SwipeEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Swipe's effect",
                desc: "Deal 4 damage to an enemy and 1 damage to all other enemies.",
                damage: [4],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [Selector<RoleModel>] | undefined {
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const games = this.route.game;
        if (!games) return;
        const roles = opponent.query();
        return [new Selector(roles, { hint: "Choose an enemy" })]
    }

    protected doRun(target: RoleModel) {
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const card = this.route.card;
        if (!card) return;
        
        // Deal 4 damage to the selected enemy
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: 4,
            })
        ]);
        
        // Deal 1 damage to all other enemies
        const allEnemies = opponent.query();
        const otherEnemies = allEnemies.filter(enemy => enemy !== target);
        if (otherEnemies.length > 0) {
            DamageModel.deal(
                otherEnemies.map(enemy => new DamageEvent({
                    type: DamageType.SPELL,
                    source: card,
                    method: this,
                    target: enemy,
                    origin: 1,
                }))
            );
        }
    }
}

