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
                desc: "Deal {{spellDamage[0]}} damage to an enemy and {{spellDamage[1]}} damage to all other enemies.",
                damage: [4, 1],
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
        
        const minions = opponent.query();
        
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: this.state.damage[0] ?? 0,
            }),
            ...minions
                .filter(enemy => enemy !== target)
                .map(enemy => new DamageEvent({
                    type: DamageType.SPELL,
                    source: card,
                    method: this,
                    target: enemy,
                    origin: this.state.damage[1] ?? 0,
                }))
        ]);
    }
}

