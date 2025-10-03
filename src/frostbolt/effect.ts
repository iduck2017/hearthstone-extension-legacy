import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType, RoleRoute, ROLE_ROUTE } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

export namespace FrostboltEffectProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = RoleRoute
}

@StoreUtil.is('frostbolt-effect')
export class FrostboltEffectModel extends EffectModel<[RoleModel],
    FrostboltEffectProps.E,
    FrostboltEffectProps.S,
    FrostboltEffectProps.C,
    FrostboltEffectProps.R,
    FrostboltEffectProps.P
> {
    constructor(loader?: Loader<FrostboltEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Frostbolt's effect",
                    desc: "Deal 3 damage to a character and Freeze it.",
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: ROLE_ROUTE,
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
        
        // Deal 3 damage to the target
        await DamageModel.run([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: 3
            })
        ])
        
        // Freeze the target
        const entries = target.child.entries;
        const frozen = entries.child.frozen;
        frozen.active();
    }
} 