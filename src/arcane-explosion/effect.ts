import { DamageEvent, DamageModel, DamageType, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";



@TemplUtil.is('arcane-explosion-effect')
export class ArcaneExplosionEffectModel extends SpellEffectModel<[]> {
    constructor(props?: ArcaneExplosionEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Arcane Explosion's effect",
                desc: "Deal {{state.damage[0]}} damage to all enemy minions.",
                damage: [1],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return [] }

    protected async doRun() {
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;
        const card = this.route.card;
        if (!card) return;
        
        // Get all enemy minions
        const roles = opponent.query(true);
        
        // Deal 1 damage to each enemy minion
        await DamageModel.run(roles.map((item) => new DamageEvent({
            type: DamageType.SPELL,
            source: card,
            method: this,
            target: item,
            origin: this.state.damage[0] ?? 0,
        })))
    }
}
