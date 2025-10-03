import { CARD_ROUTE, CardRoute, EffectModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

export namespace FrostNovaEffectProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = CardRoute
}

@StoreUtil.is('frost-nova-effect')
export class FrostNovaEffectModel extends EffectModel<[],
    FrostNovaEffectProps.E,
    FrostNovaEffectProps.S,
    FrostNovaEffectProps.C,
    FrostNovaEffectProps.R,
    FrostNovaEffectProps.P
> {
    constructor(loader?: Loader<FrostNovaEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: {
                    name: "Frost Nova's effect",
                    desc: "Freeze all enemy minions.",
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: CARD_ROUTE,
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
            const entries = role.child.entries;
            const frozen = entries.child.frozen;
            frozen.active();
        }
    }
}
