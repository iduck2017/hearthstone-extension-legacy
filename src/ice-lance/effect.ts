import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType, RoleRoute, ROLE_ROUTE, CARD_ROUTE, CardRoute } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

export namespace IceLanceEffectProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = CardRoute
}

@StoreUtil.is('ice-lance-effect')
export class IceLanceEffectModel extends EffectModel<[RoleModel],
    IceLanceEffectProps.E,
    IceLanceEffectProps.S,
    IceLanceEffectProps.C,
    IceLanceEffectProps.R,
    IceLanceEffectProps.P
> {
    constructor(loader?: Loader<IceLanceEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Ice Lance's effect",
                    desc: "Freeze a character. If it was already Frozen, deal 4 damage instead.",
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: CARD_ROUTE,
            }
        })
    }

    toRun(): [SelectEvent<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query();
        return [new SelectEvent(roles, { hint: "Choose a target" })]
    }

    protected async doRun(target: RoleModel) {
        const card = this.route.card;
        if (!card) return;
        
        // Check if target is already frozen
        const entries = target.child.entries;
        const frozen = entries.child.frozen;
        
        if (frozen.state.isActive) {
            // If already frozen, deal 4 damage instead
            await DamageModel.run([
                new DamageEvent({
                    type: DamageType.SPELL,
                    source: card,
                    method: this,
                    target,
                    origin: 4
                })
            ])
        } else frozen.active();
    }
} 