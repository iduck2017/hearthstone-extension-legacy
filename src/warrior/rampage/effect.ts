
import { Selector, SpellEffectModel, MinionCardModel, RoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('rampage-effect')
export class RampageEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: RampageEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Rampage's effect",
                desc: "Give a damaged minion +3/+3.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<MinionCardModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.minions.filter(minion => {
            const health = minion.child.health;
            return health.state.isInjured;
        });
        return new Selector(roles, { hint: "Choose a damaged minion" });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
        const target = params[0];
        if (!target) return;

        // Give the damaged minion +3/+3 buff
        const buff = new RoleBuffModel({
            state: {
                name: "Rampage's Buff",
                desc: "+3/+3",
                offset: [3, 3] // +3 Attack, +3 Health
            }
        });
        target.buff(buff);
    }
}

