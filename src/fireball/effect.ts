import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType, RoleRoute, ROLE_ROUTE, CardRoute, CARD_ROUTE, SpellEffectModel } from "hearthstone-core";
import { DebugUtil, Loader, LogLevel, Model, StoreUtil } from "set-piece";

export namespace FireballEffectProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@StoreUtil.is('fireball-effect')
export class FireballEffectModel extends SpellEffectModel<[RoleModel],
    FireballEffectProps.E,
    FireballEffectProps.S,
    FireballEffectProps.C,
    FireballEffectProps.R
> {
    constructor(loader?: Loader<FireballEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Fire ball's effect",
                    desc: "Deal {{state.damage[0]}} damage",
                    damage: [6],
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
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
        console.log('fireball-effect', this.state.damage[0]);
        DamageModel.run([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: this.state.damage[0] ?? 0
            })
        ])
    }
}