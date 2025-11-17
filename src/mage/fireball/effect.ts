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
                desc: "Deal {{spellDamage[0]}} damage",
                damage: [6],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    prepare(): Selector<RoleModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.refer.roles;
        return new Selector(roles, { hint: "Choose a target" })
    }

    protected run(target: RoleModel) {
        const card = this.route.card;
        if (!card) return;
        DamageModel.deal([
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