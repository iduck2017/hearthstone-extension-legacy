import { Selector, SpellEffectModel, RoleModel, DamageModel, DamageEvent, DamageType, RoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('inner-rage-effect')
export class InnerRageEffectModel extends SpellEffectModel<RoleModel> {
    constructor(props?: InnerRageEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Inner Rage's effect",
                desc: "Deal 1 damage to a minion and give it +2 Attack.",
                damage: [1],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<RoleModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.minions;
        return new Selector(roles, { hint: "Choose a minion" });
    }

    public async doRun(params: Array<RoleModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const card = this.route.card;
        if (!card) return;

        // Deal 1 damage to the target minion
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: this.state.damage[0] ?? 1,
            })
        ]);

        // Give the minion +2 Attack buff
        const buff = new RoleBuffModel({
            state: {
                name: "Inner Rage's Buff",
                desc: "+2 Attack.",
                offset: [2, 0] // +2 Attack, +0 Health
            }
        });
        target.buff(buff);
    }
}

