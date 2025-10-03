import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType, RoleRoute, ROLE_ROUTE, CardRoute, CARD_ROUTE } from "hearthstone-core";
import { DebugUtil, Loader, LogLevel, Model, StoreUtil } from "set-piece";

export namespace FireballEffectProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = CardRoute
}

@StoreUtil.is('fireball-effect')
export class FireballEffectModel extends EffectModel<[RoleModel],
    FireballEffectProps.E,
    FireballEffectProps.S,
    FireballEffectProps.C,
    FireballEffectProps.R,
    FireballEffectProps.P
> {
    constructor(loader?: Loader<FireballEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Fire ball's effect",
                    desc: "Deal 6 damage",
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
        DamageModel.run([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: 6
            })
        ])
    }
}