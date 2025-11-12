import { Selector, RoleModel, DamageModel, DamageEvent, DamageType, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('moonfire-effect')
export class MoonfireEffectModel extends SpellEffectModel<[RoleModel]> {
    constructor(props?: MoonfireEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Moonfire's effect",
                desc: "Deal {{spellDamage[0]}} damage.",
                damage: [1],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [Selector<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query();
        return [new Selector(roles, { hint: "Choose a target" })]
    }

    protected doRun(target: RoleModel) {
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

