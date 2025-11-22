import { DamageEvent, DamageModel, DamageType, Selector, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";



@TemplUtil.is('arcane-explosion-effect')
export class ArcaneExplosionEffectModel extends SpellEffectModel<never> {
    constructor(props?: ArcaneExplosionEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Arcane Explosion's effect",
                desc: "Deal {{spellDamage[0]}} damage to all enemy minions.",
                damage: [1],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<never> | undefined {
        return undefined
    }

    public async doRun() {
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;
        const card = this.route.card;
        if (!card) return;
        
        // Get all enemy minions
        const roles = opponent.refer.minions;
        
        // Deal 1 damage to each enemy minion
        DamageModel.deal(
            roles.map((item) => new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target: item,
                origin: this.state.damage[0] ?? 0,
            }))
        )
    }
}
