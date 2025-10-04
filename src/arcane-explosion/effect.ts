import { DamageEvent, DamageModel, DamageType, EffectModel, ROLE_ROUTE, RoleRoute, SpellEffectModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

export namespace ArcaneExplosionEffectProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@StoreUtil.is('arcane-explosion-effect')
export class ArcaneExplosionEffectModel extends SpellEffectModel<[],
    ArcaneExplosionEffectProps.E,
    ArcaneExplosionEffectProps.S,
    ArcaneExplosionEffectProps.C,
    ArcaneExplosionEffectProps.R
> {
    constructor(loader?: Loader<ArcaneExplosionEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Arcane Explosion's effect",
                    desc: "Deal {{state.damage[0]}} damage to all enemy minions.",
                    damage: [1],
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
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
