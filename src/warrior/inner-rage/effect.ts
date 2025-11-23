import { Selector, SpellEffectModel, MinionCardModel, DamageModel, DamageEvent, DamageType, BaseFeatureModel, RoleAttackBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('inner-rage-effect')
export class InnerRageEffectModel extends SpellEffectModel<MinionCardModel> {
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

    public precheck(): Selector<MinionCardModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.minions;
        return new Selector(roles, { hint: "Choose a minion" });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
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
        target.buff(new BaseFeatureModel({
            state: {
                name: "Inner Rage's Buff",
                desc: "+2 Attack.",
            },
            child: {
                buffs: [new RoleAttackBuffModel({ state: { offset: 2 } })]
            },
        }));
    }
}

