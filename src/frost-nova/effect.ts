import { EffectModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

export namespace FrostNovaEffectProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@TemplUtil.is('frost-nova-effect')
export class FrostNovaEffectModel extends SpellEffectModel<[],
    FrostNovaEffectProps.E,
    FrostNovaEffectProps.S,
    FrostNovaEffectProps.C,
    FrostNovaEffectProps.R
> {
    constructor(loader?: Loader<FrostNovaEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: {
                    name: "Frost Nova's effect",
                    desc: "Freeze all enemy minions.",
                    damage: [],
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

        // Get all enemy minions
        const roles = opponent.query(true);
        
        // Freeze all enemy minions
        for (const role of roles) {
            const feats = role.child.feats;
            const frozen = feats.child.frozen;
            frozen.active();
        }
    }
}
