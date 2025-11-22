import { EffectModel, Selector, RoleModel, DamageModel, DamageEvent, DamageType, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('pyroblast-effect')
export class PyroblastEffectModel extends SpellEffectModel<RoleModel> {
    constructor(props?: PyroblastEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Pyroblast's effect",
                desc: "Deal {{spellDamage[0]}} damage.",
                damage: [10],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    prepare(): Selector<RoleModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.refer.roles;
        return new Selector(roles, { hint: "Choose a target" });
    }

    protected run(params: RoleModel[]) {
        const target = params[0];
        if (!target) return;
        const card = this.route.card;
        if (!card) return;

        // Deal 10 damage to the target
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: this.state.damage[0] ?? 0,
            })
        ]);
    }
}
