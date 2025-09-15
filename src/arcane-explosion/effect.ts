import { DamageEvent, DamageModel, DamageType, EffectModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('arcane-explosion-effect')
export class ArcaneExplosionEffectModel extends EffectModel<[]> {
    constructor(loader?: Loader<ArcaneExplosionEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Arcane Explosion's effect",
                    desc: "Deal 1 damage to all enemy minions.",
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer } 
            }
        })
    }

    toRun(): [] { return [] }

    protected async doRun() {
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;
        const card = this.route.card;
        if (!card) return;
        
        // Get all enemy minions
        const roles = opponent.refer.roles;
        
        // Deal 1 damage to each enemy minion
        await DamageModel.run(roles.map((item) => new DamageEvent({
            type: DamageType.SPELL,
            source: card,
            detail: this,
            target: item,
            origin: 1,
        })))
    }
}
