import { Selector, DamageModel, DamageEvent, DamageType, SpellEffectModel, RoleModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";


@TemplUtil.is('fireball-effect')
export class FireballEffectModel extends SpellEffectModel<RoleModel> {
    constructor(props?: FireballEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Fire ball's effect",
                desc: "Deal *6* damage",
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    precheck(): Selector<RoleModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.refer.roles;
        return new Selector(roles, { hint: "Choose a target" })
    }

    protected async doRun(params: Array<RoleModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const card = this.route.card;
        if (!card) return;
        DamageModel.deal([
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