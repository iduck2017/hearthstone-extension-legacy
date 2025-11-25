import { Selector, SpellEffectModel, MinionCardModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('shadow-bolt-effect')
export class ShadowBoltEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: ShadowBoltEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Shadow Bolt's effect",
                desc: "Deal 4 damage to a minion.",
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

        // Deal 4 damage to the target minion
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: 4,
            })
        ]);
    }
}

