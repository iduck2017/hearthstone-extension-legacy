import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType, RoleRoute, ROLE_ROUTE, CardRoute, CARD_ROUTE, SpellEffectModel } from "hearthstone-core";
import { DebugUtil, LogLevel, Model, TemplUtil } from "set-piece";

export namespace FireballEffectProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@TemplUtil.is('fireball-effect')
export class FireballEffectModel extends SpellEffectModel<[RoleModel],
    FireballEffectProps.E,
    FireballEffectProps.S,
    FireballEffectProps.C,
    FireballEffectProps.R
> {
    constructor(props?: FireballEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Fire ball's effect",
                desc: "Deal {{state.damage[0]}} damage",
                damage: [6],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
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
                origin: this.state.damage[0] ?? 0
            })
        ])
    }
}