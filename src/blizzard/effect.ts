import { EffectModel, DamageModel, DamageEvent, DamageType, RoleRoute, ROLE_ROUTE } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

export namespace BlizzardEffectProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = RoleRoute
}

@StoreUtil.is('blizzard-effect')
export class BlizzardEffectModel extends EffectModel<[],
    BlizzardEffectProps.E,
    BlizzardEffectProps.S,
    BlizzardEffectProps.C,
    BlizzardEffectProps.R,
    BlizzardEffectProps.P
> {
    constructor(loader?: Loader<BlizzardEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: {
                    name: "Blizzard's effect",
                    desc: "Deal 2 damage to all enemy minions and Freeze them.",
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: ROLE_ROUTE,
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
        
        // Deal 2 damage to all enemy minions
        await DamageModel.run(roles.map((item) => new DamageEvent({
            type: DamageType.SPELL,
            source: card,
            method: this,
            target: item,
            origin: 2,
        })));
        // Freeze all enemy minions
        for (const role of roles) {
            const entries = role.child.entries;
            const frozen = entries.child.frozen;
            frozen.active();
        }
    }
}
